import { execFile } from 'child-process-promise';
import { readdirSync, statSync } from 'fs-extra';
import { basename, resolve } from 'path';

const runElmPath = resolve(__dirname, '../../lib/index.js');
const projectBaseDir = resolve(__dirname, 'case-projects');

describe('run-elm', () => {
  const projectDirs = readdirSync(projectBaseDir)
    .map(filename => resolve(projectBaseDir, filename))
    .filter(path => statSync(path).isDirectory());

  projectDirs.forEach((projectDir) => {
    const projectName = basename(projectDir);

    test(`correctly works for case project \`${projectName}\``, async () => {
      const { args, expectedStdout: rawExpectedStdout } = require(resolve(projectDir, 'test-config.js'));
      const expectedStdout = typeof (rawExpectedStdout) === 'function'
        ? rawExpectedStdout()
        : rawExpectedStdout;

      let result;
      try {
        result = await execFile(runElmPath, args, {
          cwd: projectDir,
          maxBuffer: 1024 * 1024 * 100
        });
      } catch (e) {
        const { code, stderr, message } = e;
        const details = stderr || message;
        throw new Error(`process timeout or non-zero exit code ${code}${details ? `: ${details}` : ''}`);
      }
      expect(result.stdout.length).toEqual(expectedStdout.length);
      expect(result.stdout).toEqual(expectedStdout);
      expect(result.stderr).toEqual('');
    }, 30000);
  });
});
