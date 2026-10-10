import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const input = process.argv[2];

if (!input) {
  console.error('Usage: pnpm test:coverage:file <test-filename>');
  console.error('Example: pnpm test:coverage:file string-utils.test.ts');
  process.exit(1);
}

const ignoredDirs = new Set(['node_modules', '.next', '.git', 'coverage', 'dist', 'build']);

async function findFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        results.push(...(await findFiles(fullPath)));
      }
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

const allFiles = await findFiles(root);

const normalizedInput = path
  .basename(input)
  .replace(/\.test\.tsx?$/, '')
  .replace(/\.tsx?$/, '');

// This will match 'string-utils.test.ts' whether its typed 'string-utils', 'string-utils.ts', or 'string-utils.test.ts'
const testFiles = allFiles.filter((file) => {
  const base = path
    .basename(file)
    .replace(/\.test\.tsx?$/, '')
    .replace(/\.tsx?$/, '');

  return base === normalizedInput && /\.test\.tsx?$/.test(file);
});

if (testFiles.length === 0) {
  console.error(`No test files found matching "${input}".`);
  process.exit(1);
}

const sourceFiles = testFiles
  .map((file) => file.replace(/[/\\]__tests__[/\\]/, path.sep).replace(/\.test\.(tsx?|jsx?)$/, (ext) => ext.slice(5)))
  .filter((file) => allFiles.includes(file));

if (sourceFiles.length === 0) {
  console.error('Could not find corresponding source files.');
  console.error('Expected tests under a __tests__ directory or next to the source file.');
  process.exit(1);
}

console.log('Test files:');
testFiles.forEach((file) => console.log(`  ${path.relative(root, file)}`));

console.log('\nCoverage files:');
sourceFiles.forEach((file) => console.log(`  ${path.relative(root, file)}`));

const args = [
  'exec',
  'vitest',
  'run',
  '--coverage',
  '--coverage.reporter=text',
  // Make sure to use posix (forward slashes) for vitest glob matching
  ...sourceFiles.map((file) => `--coverage.include=${path.relative(root, file).split(path.sep).join(path.posix.sep)}`),
  ...testFiles,
];

console.log('\nRunning:', 'pnpm ' + args.join(' '));

const result = spawnSync('pnpm', args, {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
