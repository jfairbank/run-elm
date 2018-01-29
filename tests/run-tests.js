const spawnSync = require('child_process').spawnSync;
const fs = require('fs');
const path = require('path');
const inspect = require('util').inspect;

const runElmPath = path.resolve(path.join(__dirname, '..', 'lib', 'index.js'));

const baseDir = path.resolve(path.join(__dirname, '..', 'tests'));

const testDirs = fs
  .readdirSync(baseDir)
  .map(filename => ({
    name: filename,
    path: path.join(baseDir, filename),
  }))
  .filter(test => fs.statSync(test.path).isDirectory());

const results = testDirs.map((test) => {
  const inputPath = path.join(test.path, 'input.txt');

  const rawInput = fs.readFileSync(inputPath, 'utf-8');
  const input = rawInput.trim().split(' ');

  const expectedOutput = fs.readFileSync(path.join(test.path, 'output.txt'), 'utf-8');

  let actualOutput;

  try {
    actualOutput = spawnSync(runElmPath, input, { cwd: test.path }).stdout.toString();
  } catch (err) {
    return {
      pass: false,
      reason: `${test.name} failed: Process timeout or non-zero exit code
  ${err}
`,
    };
  }

  if (actualOutput !== expectedOutput) {
    return {
      pass: false,
      reason: `${test.name} failed: Output mismatch
  Expected: ${inspect(expectedOutput)}
  Actual:   ${inspect(actualOutput)}
`,
    };
  }

  return { pass: true };
});

const failures = results
  .filter(r => !r.pass)
  .map(r => r.reason);

console.log(failures.join('\n'));

if (failures.length > 0) {
  console.log(`${failures.length} of ${results.length} test(s) failed`);
  process.exit(1);
} else {
  console.log(`All ${results.length} test(s) passed`);
}
