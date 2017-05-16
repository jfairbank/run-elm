const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const inspect = require('util').inspect;

const runElmPath = path.resolve(
  path.join(__dirname, '..', 'lib', 'index.js'));

const baseDir = path.resolve(
  path.join(__dirname, '..', 'tests'));

const testDirs = fs
  .readdirSync(baseDir)
  .map(filename => ({
    name: filename,
    path: path.join(baseDir, filename),
  }))
  .filter(test => fs.statSync(test.path).isDirectory());

const results = testDirs.map((test) => {
  const mainFile = path.join(test.path, 'Main.elm');
  const expectedOutput = fs.readFileSync(path.join(test.path, 'output.txt'));
  let actualOutput;
  try {
    actualOutput = execSync(`${runElmPath} ${mainFile}`);
  } catch (err) {
    return {
      pass: false,
      reason: `${test.name} failed: Process timeout or non-zero exit code
  ${err}
`,
    };
  }
  if (actualOutput.toString() !== expectedOutput.toString()) {
    return {
      pass: false,
      reason: `${test.name} failed: Output mismatch
  Expected: ${inspect(expectedOutput.toString())}
  Actual:   ${inspect(actualOutput.toString())}
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
