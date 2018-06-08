import execa from 'execa';
import { remove } from 'fs-extra';
import { resolve } from 'path';
import sh from 'shelljs';
import listIntegrationTests from './list';

const runElmPath = resolve(__dirname, '../../lib/cli.js');

describe('run-elm cli', () => {
  if (!sh.which('elm')) {
    throw new Error('Cannot run tests because elm is not installed globally');
  }

  listIntegrationTests().forEach(({
    projectName,
    projectDir,
    cliArgs,
    cleanElmStuff,
    expectedExitCode,
    expectedStdout,
    expectedStderr,
    title,
  }) => {
    test(`correctly works for case project \`${projectName}\`${title ? ` → ${title}` : ''}`, async () => {
      let result;
      try {
        if (cleanElmStuff) {
          await remove(resolve(projectDir, 'elm-stuff'));
        }
        result = await execa(runElmPath, cliArgs, {
          cwd: projectDir,
          maxBuffer: 1024 * 1024 * 100,
          stripEof: false,
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
