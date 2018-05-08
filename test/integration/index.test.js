import { remove } from 'fs-extra';
import { resolve } from 'path';
import sh from 'shelljs';
import listIntegrationTests from './list';
import runElm from '../../lib/index';

beforeAll(() => {
  if (!sh.which('elm')) {
    throw new Error('Cannot run tests because elm is not installed globally');
  }
});

describe('run-elm function', () => {
  listIntegrationTests().forEach(({
    projectName,
    projectDir,
    functionArgs,
    cleanElmStuff,
    expectedExitCode = 0,
    expectedStdout: untrimmedExpectedStdout,
    expectedStderr: untrimmedExpectedStderr,
    title,
  }) => {
    test(`correctly works for case project \`${projectName}\`${title ? ` → ${title}` : ''}`, async () => {
      const expectedStdout = untrimmedExpectedStdout
        ? untrimmedExpectedStdout.substring(0, untrimmedExpectedStdout.length - 1)
        : untrimmedExpectedStdout;
      const expectedStderr = untrimmedExpectedStderr
        ? untrimmedExpectedStderr.substring(0, untrimmedExpectedStderr.length - 1).replace(/^Error: /, '')
        : untrimmedExpectedStderr;

      const functionArgsWithResolvedModulePath = [
        resolve(projectDir, functionArgs[0]), ...functionArgs.slice(1)
      ];
      let result;
      try {
        if (cleanElmStuff) {
          await remove(resolve(projectDir, 'elm-stuff'));
        }
        result = await runElm(...functionArgsWithResolvedModulePath);
      } catch (e) {
        result = e;
      }
      if (expectedExitCode === 0) {
        expect(typeof result).toBe('string');

        // when long output is expected, it is cheaper to check its length first
        if (typeof expectedStdout === 'string') {
          if (expectedStdout.length > 10000) {
            expect(result.length).toEqual(expectedStdout.length);
          }
          expect(result).toEqual(expectedStdout);
        }
      } else {
        expect(result).toBeInstanceOf(Error);

        if (typeof expectedStderr === 'string') {
          if (expectedStderr.length > 10000) {
            expect(result.message.length).toEqual(expectedStderr.length);
          }
          expect(result.message).toEqual(expectedStderr);
        }
      }
    }, 30000);
  });
});
