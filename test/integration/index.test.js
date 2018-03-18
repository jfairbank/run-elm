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
    const conditions = require(resolve(projectDir, 'test-config.js'));
    conditions.forEach(({
      args,
      expectedExitCode = 0,
      expectedStdout: rawExpectedStdout,
      expectedStderr: rawExpectedStderr,
      title: rawTitle
    }, i) => {
      const autoTitle = conditions.length > 1 ? `condition ${i}` : '';
      const title = rawTitle ? `condition \`${rawTitle}\`` : autoTitle;
      test(`correctly works for case project \`${projectName}\`${title ? ` → ${title}` : ''}`, async () => {
        const expectedStdout = typeof (rawExpectedStdout) === 'function'
          ? rawExpectedStdout()
          : rawExpectedStdout;
        const expectedStderr = typeof (rawExpectedStderr) === 'function'
          ? rawExpectedStderr({ projectDir })
          : rawExpectedStderr;

        let result;
        try {
          result = await execFile(runElmPath, args, {
            cwd: projectDir,
            maxBuffer: 1024 * 1024 * 100
          });
        } catch (e) {
          result = e;
        }
        expect(result.code || 0).toEqual(expectedExitCode);

        // when long output is expected, it is cheaper to check its length first
        if (typeof expectedStdout === 'string') {
          if (expectedStdout.length > 10000) {
            expect(result.stdout.length).toEqual(expectedStdout.length);
          }
          expect(result.stdout).toEqual(expectedStdout);
        }

        if (typeof expectedStderr === 'string') {
          if (expectedStderr.length > 10000) {
            expect(result.stderr.length).toEqual(expectedStderr.length);
          }
          expect(result.stderr).toEqual(expectedStderr);
        }
      }, 30000);
    });
  });
});
