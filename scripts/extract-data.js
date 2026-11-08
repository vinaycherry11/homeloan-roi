// Run with macOS JavaScriptCore:  jsc scripts/extract-data.js -- <repo>
// Prints the locality data used by the calculator as one JSON object.
const repo = arguments[0];
const app = readFile(repo + '/frontend/static/js/app.js');
function literal(name) {
  const start = app.indexOf('const ' + name + ' = {');
  if (start < 0) throw new Error('missing ' + name);
  let i = app.indexOf('{', start), depth = 0, inStr = null;
  for (; i < app.length; i++) {
    const c = app[i];
    if (inStr) { if (c === '\\') i++; else if (c === inStr) inStr = null; continue; }
    if (c === "'" || c === '"' || c === '`') inStr = c;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) break;
  }
  return (new Function('return ' + app.slice(app.indexOf('{', start), i + 1)))();
}
const insightsSrc = readFile(repo + '/frontend/static/js/locality-insights.js');
const insights = (new Function(insightsSrc.replace('const LOCALITY_INSIGHTS', 'var LOCALITY_INSIGHTS') + '; return LOCALITY_INSIGHTS;'))();
print(JSON.stringify({ data: literal('LOCALITY_DATA'), metrics: literal('LOCALITY_METRICS'), insights }));
