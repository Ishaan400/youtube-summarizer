/**
 * Reproduction test for the dependency security bumps (CVE fixes).
 *
 * The repo has no test framework or test script, so this is a standalone Node
 * script (runnable with `node test/security-version-bumps.test.js`) that
 * verifies the dependency manifests resolve to versions at or above the
 * patched versions for the CVEs being fixed.
 *
 * It fails on the pre-change code (old vulnerable versions) and passes after
 * the bump. It only reads package.json / package-lock.json and uses Node
 * built-ins, so it exercises code that already exists.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const packages = lock.packages || {};

/** Split "1.2.3" -> [1, 2, 3] (ignore prerelease suffixes). */
function parseVersion(v) {
  return String(v)
    .trim()
    .split('.')
    .map((part) => parseInt(part.replace(/[^0-9].*$/, ''), 10))
    .map((n) => (Number.isNaN(n) ? 0 : n));
}

function gte(a, b) {
  const A = parseVersion(a);
  const B = parseVersion(b);
  for (let i = 0; i < Math.max(A.length, B.length); i++) {
    const x = A[i] || 0;
    const y = B[i] || 0;
    if (x < y) return false;
    if (x > y) return true;
  }
  return true;
}

/** Minimum version allowed by caret/tilde/exact specs like ^1.16.0 / ~3.1.4. */
function minRange(range) {
  return String(range).replace(/^[\^~><= ]+/, '');
}

function lockedVersion(pkgPath) {
  const entry = packages[pkgPath];
  return entry ? entry.version : undefined;
}

// label -> [resolved version, minimum required version]
const lockChecks = [
  ['axios', 'node_modules/axios', '1.16.0'],
  ['form-data', 'node_modules/form-data', '4.0.6'],
  ['@remix-run/router', 'node_modules/@remix-run/router', '1.23.2'],
  ['brace-expansion (root)', 'node_modules/brace-expansion', '1.1.20'],
  ['brace-expansion (glob)', 'node_modules/glob/node_modules/brace-expansion', '2.1.6'],
  ['brace-expansion (typescript-estree)', 'node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion', '2.1.6'],
  ['cross-spawn', 'node_modules/cross-spawn', '7.0.5'],
  ['flatted', 'node_modules/flatted', '3.4.2'],
  ['glob', 'node_modules/glob', '10.5.0'],
  ['js-cookie', 'node_modules/js-cookie', '3.0.7'],
  ['js-yaml', 'node_modules/js-yaml', '4.3.2'],
  ['minimatch (root)', 'node_modules/minimatch', '3.1.4'],
  ['minimatch (glob)', 'node_modules/glob/node_modules/minimatch', '9.0.7'],
  ['minimatch (typescript-estree)', 'node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch', '9.0.7'],
  ['nanoid', 'node_modules/nanoid', '3.3.12'],
  ['picomatch', 'node_modules/picomatch', '2.3.2'],
  ['postcss', 'node_modules/postcss', '8.5.18'],
  ['source-map-js', 'node_modules/source-map-js', '1.2.2'],
  ['vite', 'node_modules/vite', '5.4.21'],
];

const manifestChecks = [
  ['dependencies.axios', pkg.dependencies.axios, '1.16.0'],
  ['dependencies.mongoose', pkg.dependencies.mongoose, '7.8.9'],
  ['devDependencies.postcss', pkg.devDependencies.postcss, '8.5.18'],
];

const failures = [];
let checked = 0;

for (const [label, pkgPath, min] of lockChecks) {
  const version = lockedVersion(pkgPath);
  checked++;
  if (version === undefined) {
    failures.push(`${label}: not present in lockfile`);
  } else if (!gte(version, min)) {
    failures.push(`${label}: resolved ${version}, need >= ${min}`);
  }
}

for (const [label, range, min] of manifestChecks) {
  checked++;
  const minAllowed = minRange(range);
  if (!gte(minAllowed, min)) {
    failures.push(`${label}: spec ${range} allows ${minAllowed}, need >= ${min}`);
  }
}

console.log(`Checked ${checked} dependency pins.`);
if (failures.length > 0) {
  console.error('FAILED security version checks:');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}

console.log('All security version checks passed.');
