import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/backup-files.native.ts', import.meta.url), 'utf8');
const fixture = { version: 1, spaces: [{ id: 'home', name: 'My Home' }], cards: [], media: [] };
const canonical = JSON.stringify(fixture);

function harness(options = {}) {
  const calls = [];
  let stored = '';
  const file = {
    EncodingType: { UTF8: 'utf8' },
    StorageAccessFramework: {
      requestDirectoryPermissionsAsync: async () => options.permission ?? { granted: true, directoryUri: 'content://folder' },
      createFileAsync: async () => { calls.push('create'); if (options.createError) throw Error('create failed'); return 'content://newfile'; },
    },
    writeAsStringAsync: async (_uri, data) => { calls.push('write'); if (options.writeError) throw Error('write failed'); stored = data; },
    readAsStringAsync: async () => { calls.push('read'); if (options.readError) throw Error('read failed'); return options.readData ?? stored; },
    deleteAsync: async () => { calls.push('delete'); if (options.deleteError) throw Error('delete failed'); },
  };
  const picker = {
    getDocumentAsync: async () => options.picked ?? { canceled: false, assets: [{ uri: 'file://chosen', size: canonical.length }] },
  };
  const transpiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  const fakeRequire = (name) => {
    if (name === 'expo-document-picker') return picker;
    if (name === 'expo-file-system/legacy') return file;
    if (name === 'react-native') return { Platform: { OS: options.platform ?? 'android' } };
    if (name === './model') return { exportData: (data) => JSON.stringify(data), parseData: (raw) => {
      const data = JSON.parse(raw);
      if (data.version !== 1 || !Array.isArray(data.cards) || !Array.isArray(data.spaces) || !Array.isArray(data.media)) throw Error('Invalid backup');
      if (Buffer.byteLength(raw, 'utf8') > 2_000_000) throw Error('Backup too large');
      return data;
    } };
    throw Error(`Unexpected dependency ${name}`);
  };
  vm.runInNewContext(transpiled, { module, exports: module.exports, require: fakeRequire, Date, Error, Buffer });
  return { api: module.exports, calls };
}

test('file export is written and read back before reporting success', async () => {
  const h = harness();
  assert.match(await h.api.saveBackupFile(fixture), /saved and verified/i);
  assert.deepEqual(h.calls, ['create', 'write', 'read']);
});
test('cancelled directory selection creates no file', async () => {
  const h = harness({ permission: { granted: false } });
  assert.match(await h.api.saveBackupFile(fixture), /canceled/i);
  assert.deepEqual(h.calls, []);
});
test('failed write triggers cleanup', async () => {
  const h = harness({ writeError: true });
  await assert.rejects(h.api.saveBackupFile(fixture), /did not complete/i);
  assert.deepEqual(h.calls, ['create', 'write', 'delete']);
});
test('verification mismatch triggers cleanup', async () => {
  const h = harness({ readData: '{}' });
  await assert.rejects(h.api.saveBackupFile(fixture), /verification failed/i);
  assert.deepEqual(h.calls, ['create', 'write', 'read', 'delete']);
});
test('cleanup failure explicitly warns of leftover file', async () => {
  const h = harness({ writeError: true, deleteError: true });
  await assert.rejects(h.api.saveBackupFile(fixture), /possibly incomplete file may remain/i);
});
test('canceled picker makes no file read', async () => {
  const h = harness({ picked: { canceled: true, assets: [] } });
  assert.equal(await h.api.pickBackupFile(), null);
  assert.deepEqual(h.calls, []);
});
test('selected valid backup is canonicalized', async () => {
  const h = harness({ readData: canonical });
  assert.equal(await h.api.pickBackupFile(), canonical);
});
test('oversized file rejected before read', async () => {
  const h = harness({ picked: { canceled: false, assets: [{ uri: 'file://big', size: 2_000_001 }] } });
  await assert.rejects(h.api.pickBackupFile(), /too large/i);
  assert.deepEqual(h.calls, []);
});
test('invalid import rejected', async () => {
  const h = harness({ readData: '{"version":99,"spaces":[],"cards":[],"media":[]}' });
  await assert.rejects(h.api.pickBackupFile(), /Invalid backup/i);
});
test('other platforms reject file export', async () => {
  const h = harness({ platform: 'ios' });
  await assert.rejects(h.api.saveBackupFile(fixture), /Android only/i);
});
