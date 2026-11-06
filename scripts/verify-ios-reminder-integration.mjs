#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultIos = fileURLToPath(new URL('../ios/', import.meta.url));
const providerRelative = 'Pods/Target Support Files/Pods-CasitaDexDev/ExpoModulesProvider.swift';

/** Read-only generated-native preflight. This is integration evidence, not delivery/device QA. */
export function verifyIosReminderIntegration(iosDirectory = defaultIos) {
  const ios = resolve(iosDirectory);
  const errors = [];
  const read = relative => {
    try { return readFileSync(resolve(ios, relative), 'utf8'); }
    catch (error) { errors.push(`Cannot read ${relative}: ${error.code ?? error.message}`); return ''; }
  };
  const lock = read('Podfile.lock');
  const pods = lock.match(/^PODS:\s*\n([\s\S]*?)(?=^\S|$(?![\s\S]))/m)?.[1] ?? '';
  if (!/^  - CasitaDexReminderAlerts \([^\n]+\)/m.test(pods)) {
    errors.push('Podfile.lock PODS section is missing CasitaDexReminderAlerts.');
  }
  // Ignore comments so disabled registrations cannot satisfy the gate.
  const provider = read(providerRelative).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  if (!/^\s*(?:(?:internal|public|private|fileprivate)\s+)?import\s+CasitaDexReminderAlerts\s*$/m.test(provider)) {
    errors.push('ExpoModulesProvider.swift is missing import CasitaDexReminderAlerts.');
  }
  const moduleList = provider.match(/func\s+getModuleClasses\s*\([^)]*\)[^{]*\{\s*return\s*\[([\s\S]*?)\]/)?.[1] ?? '';
  if (!/\bCasitaDexReminderAlertsModule\s*\.self\b/.test(moduleList)) {
    errors.push('getModuleClasses() does not register CasitaDexReminderAlertsModule.self.');
  }
  const subscriberList = provider.match(/func\s+getAppDelegateSubscribers\s*\([^)]*\)[^{]*\{\s*return\s*\[([\s\S]*?)\]/)?.[1] ?? '';
  if (!/\bCasitaDexReminderAlertsAppDelegateSubscriber\s*\.self\b/.test(subscriberList)) {
    errors.push('getAppDelegateSubscribers() does not register CasitaDexReminderAlertsAppDelegateSubscriber.self.');
  }
  return { ok: errors.length === 0, iosDirectory: ios, providerPath: resolve(ios, providerRelative), errors };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length > 3 || process.argv[2]?.startsWith('-')) {
    console.error('Usage: node scripts/verify-ios-reminder-integration.mjs [ios-directory]');
    process.exitCode = 2;
  } else {
    const result = verifyIosReminderIntegration(process.argv[2]);
    if (result.ok) console.log(`PASS: iOS reminder pod, module and app-delegate subscriber integrated in ${result.iosDirectory}`);
    else {
      console.error(`FAIL: iOS reminder integration in ${result.iosDirectory}\n${result.errors.map(error => '- ' + error).join('\n')}\nRun the approved CocoaPods installation for this checkout, then rerun this preflight before building. No files were changed.`);
      process.exitCode = 1;
    }
  }
}
