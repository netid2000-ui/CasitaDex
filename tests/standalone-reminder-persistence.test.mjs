import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { DatabaseSync } from 'node:sqlite';
import * as recurrence from '../src/reminder-recurrence.ts';

test('native reminder completion preserves SQLite row on DST rejection and resumes after edit', async () => {
 const raw = new DatabaseSync(':memory:');
 const db = {
  execAsync: async sql => raw.exec(sql),
  getAllAsync: async (sql,...params) => raw.prepare(sql).all(...params),
  getFirstAsync: async (sql,...params) => raw.prepare(sql).get(...params),
  runAsync: async (sql,...params) => raw.prepare(sql).run(...params),
 };
 let changes = 0;
 const source = fs.readFileSync(new URL('../src/standalone-reminders.native.ts', import.meta.url),'utf8');
 const js = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module = {exports:{}};
 const dependencies = {
  './reminder-notification-changes': {notifyReminderChanges: () => {changes++;}},
  './reminder-recurrence': recurrence,
  'expo-sqlite': {openDatabaseAsync: async () => db},
 };
 vm.runInNewContext(js,{module,exports:module.exports,require:name=>{assert.ok(name in dependencies,name);return dependencies[name];},Date,Math,Error,Promise});
 const api = module.exports;
 const oldZone = process.env.TZ;
 try {
  process.env.TZ = 'America/Chicago';
  await api.saveStandaloneReminder({title:'Filter',notes:'Exact note',dueDate:'2026-03-07',dueTime:'02:30',repeat:'daily'});
  const saved = (await api.listStandaloneReminders())[0];
  assert.equal(changes,1);
  await assert.rejects(api.completeStandaloneReminder(saved.id,true),/Edit the reminder time/);
  assert.equal(JSON.stringify((await api.listStandaloneReminders())[0]),JSON.stringify(saved));
  assert.equal(changes,1,'failed completion must not notify reconciliation');
  await api.saveStandaloneReminder({...saved,dueTime:'03:30'});
  await api.completeStandaloneReminder(saved.id,true);
  const advanced = (await api.listStandaloneReminders())[0];
  assert.equal(advanced.dueDate,'2026-03-08');
  assert.equal(advanced.dueTime,'03:30');
  assert.equal(advanced.notes,'Exact note');
  assert.equal(advanced.completed,false);
  assert.equal(changes,3);
  await api.deleteStandaloneReminder(saved.id);
  assert.equal((await api.listStandaloneReminders()).length,0);
  assert.equal(changes,4);
 } finally {
  raw.close();
  if(oldZone===undefined)delete process.env.TZ;else process.env.TZ=oldZone;
 }
});
