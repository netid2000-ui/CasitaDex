// Bounded engine-independent contract. Bundle with actual Metro for each native platform.
const query = require('query-string');
function equal(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(label + ': ' + JSON.stringify(actual));
}
equal(query.parse('r=a%2Bb&x=one+two').r, 'a+b', 'encoded plus');
equal(query.parse('r=a%2Bb&x=one+two').x, 'one two', 'space');
equal(query.parseUrl('/r#one+two', {parseFragmentIdentifier: true}).fragmentIdentifier, 'one two', 'legacy fragment');
equal(query.parse('r=%2541x%41%zz').r, '%41xA%zz', 'no rescanning');
const ids=['literal%2F','literal%252F','a/b?c&d#e+f','café 日本 🏠','%GG','x'.repeat(512)];
for (const id of ids) equal(query.parse(query.stringify({id})).id, id, 'identity');
console.log('DECODER_METRO_INTEROP_PASS ' + ids.length + ' identities');
