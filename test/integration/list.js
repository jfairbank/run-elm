import { readdirSync, statSync } from 'fs-extra';
import { basename, resolve } from 'path';

const projectBaseDir = resolve(__dirname, 'case-projects');

export default () => {
  const result = [];
  const projectDirs = readdirSync(projectBaseDir)
    .map(filename => resolve(projectBaseDir, filename))
    .filter(path => statSync(path).isDirectory());

  projectDirs.forEach((projectDir) => {
    const projectName = basename(projectDir);
    const conditions = require(resolve(projectDir, 'test-config.js'));
    conditions.forEach(({
      cliArgs: rawCliArgs,
      functionArgs: rawFunctionArgs,
      cleanElmStuff,
      expectedExitCode = 0,
      expectedStdout: rawExpectedStdout,
      expectedStderr: rawExpectedStderr,
      title: rawTitle
    }, i) => {
      const autoTitle = conditions.length > 1 ? `condition ${i}` : '';
      const title = rawTitle ? `condition \`${rawTitle}\`` : autoTitle;
      const cliArgs = typeof (rawCliArgs) === 'function'
        ? rawCliArgs()
        : rawCliArgs;
      const functionArgs = typeof (rawFunctionArgs) === 'function'
        ? rawFunctionArgs()
        : rawFunctionArgs;
      const expectedStdout = typeof (rawExpectedStdout) === 'function'
        ? rawExpectedStdout()
        : rawExpectedStdout;
      const expectedStderr = typeof (rawExpectedStderr) === 'function'
        ? rawExpectedStderr({ projectDir })
        : rawExpectedStderr;
      result.push({
        projectName,
        projectDir,
        cliArgs,
        functionArgs,
        cleanElmStuff,
        expectedExitCode,
        expectedStdout,
        expectedStderr,
        title,
      });
    });
  });
  return result;
};
