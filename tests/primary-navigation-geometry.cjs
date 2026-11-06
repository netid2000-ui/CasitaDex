// Browser geometry proxy, NOT native Dynamic Type or VoiceOver acceptance.
// Renders the actual shell and navigation styles via React Native Web, with
// mocked window dimensions, safe insets and scaled label metrics. The Slot is
// deliberately a long scrollable fixture; real Home routes use the separate
// current-home-browser.cjs test. No app storage or native device is accessed.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript'), React = require('react');
const RN = require('react-native-web');
const { renderToStaticMarkup } = require('react-dom/server');
const { chromium } = require('playwright');
const { primaryNavigationRows } = require('../src/primary-navigation-layout.ts');
const { lightColors, darkColors } = require('../src/theme.ts');

function load(file, mocks, extra = '') {
  const input = fs.readFileSync(path.join(__dirname, '..', 'src', file), 'utf8');
  const js = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js + extra, { module: mod, exports: mod.exports, require: name => {
    if (!(name in mocks)) throw Error('Unexpected import: ' + name);
    return mocks[name];
  } });
  return mod.exports;
}
const ui = load('ui.tsx', { react: React, 'react-native': RN, './state': {}, './theme': { lightColors, darkColors } }, '\nmodule.exports.makeStyles = makeStyles;');
function documentFor(fixture) {
  const colors = fixture.dark ? darkColors : lightColors;
  const s = ui.makeStyles(colors);
  function SafeArea({ edges = [], style, children }) {
    return React.createElement(RN.View, { style: [style, {
      paddingTop: edges.includes('top') ? fixture.top : 0,
      paddingBottom: edges.includes('bottom') ? fixture.bottom : 0,
      paddingLeft: edges.includes('left') ? fixture.left : 0,
      paddingRight: edges.includes('right') ? fixture.right : 0,
    }] }, children);
  }
  function ScaledText({ style, ...props }) {
    const plain = RN.StyleSheet.flatten(style) || {};
    return React.createElement(RN.Text, { ...props, style: [style, { fontSize: (plain.fontSize || 14) * fixture.scale }] });
  }
  function Slot() {
    return React.createElement(RN.ScrollView, { testID: 'content-viewport' },
      React.createElement(RN.Text, { accessibilityRole: 'header', style: { fontSize: 31 * fixture.scale } }, 'Your home, remembered'),
      React.createElement(RN.View, { style: { height: 800 } }),
      React.createElement(RN.Pressable, { accessibilityRole: 'button', accessibilityLabel: 'Last content action', testID: 'last-content-action', style: { minHeight: 55, backgroundColor: colors.accent } },
        React.createElement(RN.Text, { style: { fontSize: 17 * fixture.scale } }, 'Last content action')));
  }
  const api = load('app/_layout.tsx', {
    react: React,
    'react-native': { ...RN, Text: ScaledText, useWindowDimensions: () => ({ width: fixture.width, height: fixture.height, fontScale: fixture.scale }) },
    'expo-status-bar': { StatusBar: () => null },
    'react-native-safe-area-context': { SafeAreaView: SafeArea, SafeAreaProvider: RN.View, useSafeAreaInsets: () => fixture },
    'expo-router': { Slot, router: {}, usePathname: () => '/', useRootNavigationState: () => undefined },
    '../reminder-alerts': {}, '../state': {}, '../brand-web-meta': { BrandWebMeta: () => null },
    '../ui': { useTheme: () => ({ colors, s, dark: fixture.dark }) },
    '../eng-navigation': { guardedNavigate: fn => fn() }, '../primary-navigation-layout': { primaryNavigationRows },
    '../accepted-navigation-icon': { AcceptedNavigationIcon: () => React.createElement(RN.View, { style: { width: 26, height: 26 } }) },
  }, '\nmodule.exports.Shell = Shell;');
  RN.AppRegistry.registerComponent('NavigationGeometry', () => api.Shell);
  const app = RN.AppRegistry.getApplication('NavigationGeometry', {});
  return '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">' +
    renderToStaticMarkup(app.getStyleElement()) +
    '<style>html,body,#root{margin:0;width:100%;height:100%;overflow:hidden}#root{display:flex}</style></head><body><div id="root">' +
    renderToStaticMarkup(app.element) + '</div></body></html>';
}
(async () => {
  const out = path.resolve(process.env.CASITADEX_NAV_EVIDENCE || path.join(__dirname, '..', 'nav-geometry-evidence'));
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const fixture of [
      { name: 'ordinary-portrait', width: 402, height: 874, scale: 1, top: 62, bottom: 34, left: 0, right: 0, rows: 1 },
      { name: 'ordinary-landscape', width: 874, height: 402, scale: 1, top: 0, bottom: 20, left: 62, right: 62, rows: 1 },
      { name: 'narrow-portrait', width: 320, height: 568, scale: 1, top: 20, bottom: 0, left: 0, right: 0, rows: 2 },
      { name: 'max-portrait-dark', width: 402, height: 874, scale: 3.571, top: 62, bottom: 34, left: 0, right: 0, rows: 2, dark: true },
      { name: 'max-landscape-dark', width: 874, height: 402, scale: 3.571, top: 0, bottom: 20, left: 62, right: 62, rows: 2, dark: true },
      { name: 'max-landscape-light', width: 874, height: 402, scale: 3.571, top: 0, bottom: 20, left: 62, right: 62, rows: 2 },
      { name: 'large-landscape-390', width: 844, height: 390, scale: 3.571, top: 0, bottom: 21, left: 47, right: 47, rows: 2 },
      { name: 'small-landscape-320', width: 568, height: 320, scale: 3.571, top: 0, bottom: 0, left: 0, right: 0, rows: 2 },
    ]) {
      const page = await browser.newPage({ viewport: { width: fixture.width, height: fixture.height } });
      await page.setContent(documentFor(fixture));
      const data = await page.evaluate(() => {
        const box = el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height, right: b.right, bottom: b.bottom }; };
        const content = document.querySelector('[data-testid="content-viewport"]');
        return {
          tabs: Array.from(document.querySelectorAll('[role="tab"]')).map(el => ({ label: el.getAttribute('aria-label'), ...box(el), clippedText: Array.from(el.children).some(c => c.scrollWidth > c.clientWidth + 1 || c.scrollHeight > c.clientHeight + 1) })),
          nav: box(document.querySelector('[aria-label="Primary navigation"]')),
          content: box(content), contentScrollHeight: content.scrollHeight,
        };
      });
      assert.deepEqual(data.tabs.map(t => t.label), ['Home', 'Photos', 'Reminders', 'Find']);
      assert.equal(new Set(data.tabs.map(t => t.y)).size, fixture.rows, fixture.name + ': wrong row count');
      for (const tab of data.tabs) {
        assert.ok(tab.width >= 44 && tab.height >= 44, fixture.name + ': target under 44pt');
        assert.ok(tab.x >= fixture.left && tab.right <= fixture.width - fixture.right + 1, fixture.name + ': safe-area horizontal overflow');
        assert.ok(tab.bottom <= fixture.height - fixture.bottom + 1, fixture.name + ': safe-area bottom overflow');
        assert.equal(tab.clippedText, false, fixture.name + ': clipped text');
      }
      const usableHeight = fixture.height - fixture.top - fixture.bottom;
      const minimumContent = Math.min(160, usableHeight * 0.35);
      assert.ok(data.content.height >= minimumContent, fixture.name + ': content viewport lost or too small: ' + data.content.height);
      assert.ok(data.content.bottom <= data.nav.y + 1, fixture.name + ': content is covered by navigation');
      assert.ok(data.contentScrollHeight > data.content.height, fixture.name + ': fixture not scrollable');
      await page.getByRole('button', { name: 'Last content action', exact: true }).scrollIntoViewIfNeeded();
      const last = await page.getByTestId('last-content-action').boundingBox();
      assert.ok(last.y >= data.content.y - 1 && last.y + last.height <= data.content.bottom + 1, fixture.name + ': final content action not reachable');
      await page.screenshot({ path: path.join(out, fixture.name + '.png') });
      results.push({ fixture, status: 'PASS', ...data });
      console.log('PASS ' + fixture.name + ': ' + fixture.rows + ' nav rows, content ' + data.content.height + 'px, every tab >=44px, last scroll action reachable');
      await page.close();
    }
    fs.writeFileSync(path.join(out, 'geometry-results.json'), JSON.stringify({ status: 'PASS', scope: 'React Native Web geometry proxy; native scaling/VoiceOver NOT TESTED', results }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
