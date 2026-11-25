#!/usr/bin/env node
// Dependency-free source-QA coordinator. Does not build, install or control devices.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname, platform } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const matrixPath = join(root, 'docs/qa/research-informed-workflow-matrix.json');
const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const args = process.argv.slice(2);
const getArg = (key) => {
  const i = args.indexOf(key);
  return i >= 0 ? args[i + 1] : undefined;
};
const fail = (message) => { console.error(message); process.exit(2); };
const mode = args.includes('--run') ? 'run' : 'plan';
if (args.includes('--run') && args.includes('--plan')) fail('Choose --plan or --run.');
if (matrix.project !== pkg.name) fail('Project manifest does not match package.json.');
const statuses = new Set(['PASS', 'FAIL', 'BLOCKED', 'SKIPPED', 'NOT_RUN']);
const ids = new Set();
const paths = new Set();
const errors = [];
for (const c of matrix.cases) {
  if (!c.id || ids.has(c.id) || !c.workflow || !c.acceptance) errors.push('Invalid/duplicate workflow: ' + c.id);
  ids.add(c.id);
  if (!c.figma || !c.current || !c.historical || !Array.isArray(c.sourceTests)) errors.push('Incomplete matrix row: ' + c.id);
  for (const s of Object.values(c.current || {})) if (!statuses.has(s)) errors.push('Invalid status: ' + c.id);
  for (const p of c.sourceTests || []) {
    const absolute = resolve(root, p);
    const rel = relative(root, absolute);
    if (isAbsolute(rel) || rel === '..' || rel.startsWith('../') || !p.startsWith('tests/')) {
      errors.push('Invalid test reference: ' + p);
    } else {
      paths.add(p);
      if (!existsSync(absolute)) errors.push('Missing test reference: ' + p);
    }
  }
}
const allowed = new Set(['typecheck', 'test', 'test:domain', 'lint']);
for (const script of matrix.sourceCommands) {
  if (!allowed.has(script) || typeof pkg.scripts?.[script] !== 'string') errors.push('Missing or unsupported existing source script: ' + script);
}
const suite = matrix.sourceCommands.find(s => s === 'test' || s === 'test:domain');
const suiteCommand = pkg.scripts?.[suite] || '';
// Coverage is a reference inventory, not proof that every mapped test is executed.
const mappedOutsideSuite = [...paths].filter(p => !(suiteCommand.includes(p) || (suiteCommand.includes('tests/*.test.mjs') && /^tests\/[^/]+\.test\.mjs$/.test(p))));
const plan = {
  project: matrix.project,
  workflows: ids.size,
  uniqueTestReferences: paths.size,
  knownHistoricalFigmaReferences: matrix.cases.filter(c => c.figma?.iosOrFamilyNode || c.figma?.androidNode).length,
  sourceCommands: matrix.sourceCommands,
  mappedTestReferencesOutsideExistingSuite: mappedOutsideSuite,
  nativeAcceptance: 'NOT_RUN',
  nativeOrder: matrix.nativeOrder,
  errors
};
console.log(JSON.stringify(plan, null, 2));
if (errors.length) process.exit(2);
if (mode === 'plan') process.exit(0);

const expected = getArg('--expected-host');
const evidenceArg = getArg('--evidence-root');
if (platform() !== 'darwin' || !expected || hostname().toLowerCase() !== expected.toLowerCase()) {
  fail('Source QA execution is restricted to the designated Mac mini. Supply its observed hostname.');
}
if (!evidenceArg || !isAbsolute(evidenceArg)) fail('Supply an absolute approved external evidence folder.');
const evidenceRoot = resolve(evidenceArg);
const relEvidence = relative(root, evidenceRoot);
if (!isAbsolute(relEvidence) && relEvidence !== '..' && !relEvidence.startsWith('../')) fail('Evidence folder must be outside the source checkout.');
if (!existsSync(evidenceRoot)) fail('Evidence root does not exist; use the approved mounted drive.');
const runDir = join(evidenceRoot, matrix.project + '-' + new Date().toISOString().replace(/[:.]/g, '-'));
mkdirSync(runDir, { recursive: false });
const git = (...a) => {
  const r = spawnSync('git', a, { cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024 });
  return r.status === 0 ? r.stdout.trim() : null;
};
const report = {
  schemaVersion: 1,
  project: matrix.project,
  startedAt: new Date().toISOString(),
  host: hostname(),
  platform: platform(),
  node: process.version,
  sourceCommit: git('rev-parse', 'HEAD'),
  trackedDirty: git('status', '--porcelain', '--untracked-files=no') !== '',
  expoVersion: pkg.dependencies?.expo ?? null,
  matrixPlan: plan,
  nativeAcceptance: 'NOT_RUN',
  runs: []
};
const save = () => writeFileSync(join(runDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
save();
if (!report.sourceCommit || !existsSync(join(root, 'node_modules'))) {
  report.status = 'BLOCKED';
  report.reason = 'Git identity or existing installed dependencies unavailable; no installation attempted.';
  report.finishedAt = new Date().toISOString();
  save();
  process.exit(2);
}
for (const script of matrix.sourceCommands) {
  const start = Date.now();
  // Existing project scripts only; no network setup, deployment or package download.
  const result = spawnSync('npm', ['run', script], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    timeout: 20 * 60 * 1000,
    env: { ...process.env, CI: '1' }
  });
  const output = (result.stdout || '') + '\n' + (result.stderr || '');
  const logName = script.replace(/[^a-zA-Z0-9_-]/g, '_') + '.log';
  writeFileSync(join(runDir, logName), output);
  const counts = {};
  for (const key of ['tests', 'pass', 'fail', 'skipped', 'cancelled', 'todo']) {
    const matches = [...output.matchAll(new RegExp('^(?:#|ℹ)\\s+' + key + '\\s+(\\d+)\\s*$', 'gm'))];
    if (matches.length) counts[key] = Number(matches[matches.length - 1][1]);
  }
  const status = result.error || result.status === null ? 'BLOCKED'
    : result.status !== 0 || (counts.fail || 0) > 0 || (counts.cancelled || 0) > 0 ? 'FAIL' : 'PASS';
  report.runs.push({ script, status, exitCode: result.status, signal: result.signal, error: result.error?.message || null, durationMs: Date.now() - start, counts, log: logName });
  save();
}
report.status = report.runs.every(x => x.status === 'PASS') ? 'PASS' : report.runs.some(x => x.status === 'FAIL') ? 'FAIL' : 'BLOCKED';
report.finishedAt = new Date().toISOString();
save();
console.log('Source QA evidence: ' + runDir);
console.log('Native acceptance remains NOT_RUN.');
process.exit(report.status === 'PASS' ? 0 : 1);
