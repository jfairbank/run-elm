import { stat, readFile, writeFile, unlink, openSync, exists } from 'fs-extra';
import { compileSync } from 'node-elm-compiler';
import sh from 'shelljs';
import path from 'path';
import defaultOptions from './defaultOptions';

export default async (userModuleFileName, {
  outputName = defaultOptions.outputName,
  projectDir,
  report = defaultOptions.report,
  pathToElmMake,
  argsToOutput = [],
} = {}) => {
  // extract key paths
  const moduleId = `${+new Date()}${Math.round(Math.random() * 100000000)}`;
  const mainModule = `RunElmMain${moduleId}`;
  const templatePath = path.resolve(__dirname, 'RunElmMain.elm.template');
  const templateWithArgsPath = path.resolve(__dirname, 'RunElmMainWithArgs.elm.template');
  const userModulePath = path.resolve(userModuleFileName);
  const userModule = path.basename(userModulePath, '.elm');
  const resolvedProjectDir = (projectDir
    ? path.resolve(projectDir)
    : path.resolve(path.dirname(userModulePath)));
  const mainModuleFilename = path.join(resolvedProjectDir, `${mainModule}.elm`);
  const outputCompiledFilename = path.join(resolvedProjectDir, `run-elm-main-${moduleId}.js`);
  const elmCompileStdout = path.join(resolvedProjectDir, `stdout-${moduleId}.txt`);
  const elmCompileStderr = path.join(resolvedProjectDir, `stderr-${moduleId}.txt`);

  try {
    // ensure global elm is installed (unless pathToElmMake is given)
    if (!pathToElmMake && !sh.which('elm')) {
      throw new Error('No elm global binary available. Please install with `npm install -g elm`.');
    }

    // ensure --output-name is specified adequately
    if (!outputName.match(/^[a-z_]\w*$/)) {
      throw new Error(`Provided output name \`${outputName}\` is not a valid constant or function name in elm.`);
    }
    if (['init', 'main', 'program', 'sendOutput'].includes(outputName)) {
      throw new Error(`It is not allowed to use \`${outputName}\` as a value for output name. Please rename the symbol you would like to output.`);
    }

    // ensure user module path is adequate
    try {
      const userModuleFileStats = await stat(userModulePath);
      if (!userModuleFileStats.isFile()) {
        throw new Error();
      }
    } catch (err) {
      throw new Error(`File \`${userModulePath}\` does not exist.`);
    }
    if (!userModulePath.match(/\.elm$/i, '')) {
      throw new Error(`File \`${userModulePath}\` should have .elm file extension.`);
    }

    // ensure project folder is adequate
    try {
      const projectDirStats = await stat(resolvedProjectDir);
      if (!projectDirStats.isDirectory()) {
        throw new Error();
      }
    } catch (err) {
      throw new Error(`Provided project dir \`${resolvedProjectDir}\` is not a directory.`);
    }
    if (!userModulePath.startsWith(`${resolvedProjectDir}${path.sep}`)) {
      throw new Error(`File \`${resolvedProjectDir}\` must be located within project dir \`${projectDir}\`.`);
    }

    // ensure report format is adequate
    if (!['normal', 'json'].includes(report)) {
      throw new Error(`It is not allowed to use \`${report}\` as a value for report. Please use \`normal\` or \`json\`.`);
    }

    // read user module and determine what template to use
    let userModuleContents;
    try {
      userModuleContents = await readFile(userModulePath, 'utf-8');
    } catch (err) {
      throw new Error(`File '${userModulePath}' could not be read.`);
    }
    const argsRegex = new RegExp(`^${outputName} +\\w+ *=`);
    const needArgs = userModuleContents
      .split('\n')
      .some(line => argsRegex.test(line.trim()));

    // read main module template
    sh.cd(resolvedProjectDir);
    let template;
    const chosenTemplatePath = needArgs ? templateWithArgsPath : templatePath;
    try {
      template = await readFile(chosenTemplatePath, 'utf-8');
    } catch (err) {
      throw new Error(`Elm file '${chosenTemplatePath}' does not exist.`);
    }

    // create main module file from template
    const mainModuleContents = template
      .replace('{mainModule}', mainModule)
      .replace('{userModule}', userModule)
      .replace(/\{output\}/g, outputName);
    await writeFile(mainModuleFilename, mainModuleContents, 'utf-8');

    // compile main module
    compileSync([mainModuleFilename], {
      yes: true,
      report,
      pathToMake: pathToElmMake,
      output: outputCompiledFilename,
      processOpts: {
        stdio: [0, openSync(elmCompileStdout, 'w'), openSync(elmCompileStderr, 'w')]
      }
    });
    if (!await exists(outputCompiledFilename)) {
      const errorMessage = `Compilation failed\n${await readFile(elmCompileStderr, 'utf8')}${await readFile(elmCompileStdout, 'utf8')}`;
      throw new Error(errorMessage);
    }

    // run compiled elm file
    let result;
    await new Promise((resolve) => {
      const { worker } = require(outputCompiledFilename)[mainModule];
      const app = needArgs ? worker(argsToOutput) : worker();
      app.ports.sendOutput.subscribe((output) => {
        result = output;
        resolve();
      });
    });
    return result;
  } catch (err) {
    // handle error
    let message;
    if (typeof err === 'object' && 'message' in err) {
      if (err.message.indexOf(`does not expose \`${outputName}\``) !== -1) {
        message = `Elm file \`${userModulePath}\` does not define \`${outputName}\`.`;
      } else if (err.message.indexOf(`I cannot find module '${userModule}'`) !== -1) {
        message = `Elm file \`${userModulePath}\` cannot be reached from project dir \`${resolvedProjectDir}\`. Have you configured \`source-directories\` in elm-package.json?`;
      } else {
        message = err.message;
      }
    } else {
      message = err;
    }
    err.message = message;
    throw err;
  } finally {
    // cleanup
    await Promise.all([
      unlink(mainModuleFilename).catch(() => {}),
      unlink(outputCompiledFilename).catch(() => {}),
      unlink(elmCompileStdout).catch(() => {}),
      unlink(elmCompileStderr).catch(() => {}),
    ]);
  }
};
