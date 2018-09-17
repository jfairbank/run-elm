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
    expectedOutput,
    expectedError,
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
        });
      } catch (e) {
        result = e;
      }
      expect(result.code || 0).toEqual(expectedExitCode);

      // when long output is expected, it is cheaper to check its length first
      if (typeof expectedOutput === 'string') {
        if (expectedOutput.length > 10000) {
          expect(result.stdout.length).toEqual(expectedOutput.length);
        }
        expect(result.stdout).toEqual(expectedOutput);
      }

      if (typeof expectedError === 'string') {
        if (expectedError.length > 10000) {
          expect(result.stderr.length - 1).toEqual(expectedError.length);
        }
        expect(result.stderr.replace(/\r?\n$/, '')).toEqual(expectedError);
      }
    }, 30000);
  });
});
