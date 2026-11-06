// Maintained compatibility bridge; official decoder source is never modified.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {createRequire} = require('node:module');
const spec = require('./decoder-interop.json');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function check(apply = false) {
  const query = require.resolve('query-string');
  const decoder = createRequire(query).resolve('decode-uri-component');
  const metadata = file => JSON.parse(fs.readFileSync(path.join(path.dirname(file), 'package.json'), 'utf8'));
  if (metadata(query).version !== spec.queryVersion || metadata(decoder).version !== spec.decoderVersion) throw new Error('Decoder bridge version drift');
  if (hash(fs.readFileSync(decoder)) !== spec.decoder) throw new Error('Official decoder source integrity mismatch');
  const source = fs.readFileSync(query, 'utf8');
  const actual = hash(source);
  if (actual === spec.after) return 'already verified';
  if (actual !== spec.before) throw new Error('query-string source drift; refusing to patch');
  if (!apply) throw new Error('Decoder bridge missing. Run node scripts/decoder-interop.cjs --apply, then repeat all checks.');
  if (source.split(spec.old).length !== 2) throw new Error('Expected exactly one decoder import');
  const patched = source.replace(spec.old, spec.replacement);
  if (hash(patched) !== spec.after) throw new Error('Bridge output integrity mismatch');
  fs.writeFileSync(query, patched);
  return 'applied and verified';
}
module.exports = check;
if (require.main === module) {
  if (!['--apply', '--check'].includes(process.argv[2])) throw new Error('Expected --apply or --check');
  console.log('Decoder bridge:', check(process.argv[2] === '--apply'));
}
