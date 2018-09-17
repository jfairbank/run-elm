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

const standardConsoleLog = console.log;
const standardConsoleWarn = console.warn;
const standardConsoleError = console.error;
const standardProcessExit = process.exit;

describe('run-elm function', () => {
  listIntegrationTests().forEach(({
    projectName,
    projectDir,
    functionArgs,
    cleanElmStuff,
    expectedExitCode = 0,
    expectedOutput,
    expectedError,
    title,
  }) => {
    test(`correctly works for case project \`${projectName}\`${title ? ` → ${title}` : ''}`, async () => {
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

      expect(console.log).toBe(standardConsoleLog);
      expect(console.warn).toBe(standardConsoleWarn);
      expect(console.error).toBe(standardConsoleError);
      expect(process.exit).toBe(standardProcessExit);

      if (expectedExitCode === 0) {
        expect(typeof result.output).toBe('string');
        expect(result.debugLog).toBeInstanceOf(Array);
        const stdOut = `${result.debugLog.length ? `${result.debugLog.join('\n')}\n` : ''}${result.output}`;

        // when long output is expected, it is cheaper to check its length first
        if (typeof expectedOutput === 'string') {
          if (expectedOutput.length > 10000) {
            expect(stdOut.length).toEqual(expectedOutput.length);
          }
          expect(stdOut).toEqual(expectedOutput);
        }
      } else {
        expect(result).toBeInstanceOf(Error);

        if (typeof expectedError === 'string') {
          if (expectedError.length > 10000) {
            expect(result.message.length).toEqual(expectedError.length);
          }
          expect(result.message).toEqual(expectedError);
        }
      }
    }, 30000);
  });
});
