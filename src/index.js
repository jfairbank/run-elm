import {
  stat, readFile, writeFile, unlink
} from 'fs-extra';
import { compileToString } from 'node-elm-compiler';
import sh from 'shelljs';
import path from 'path';
import defaultOptions from './defaultOptions';

const noop = () => {};

export default async (userModuleFileName, {
  outputName = defaultOptions.outputName,
  projectDir,
  report = defaultOptions.report,
  pathToElm,
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

  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;

  try {
    // ensure global elm is installed (unless pathToElm is given)
    if (!pathToElm && !sh.which('elm')) {
      throw new Error('No elm global binary available. Please install with `npm install -g elm`.');
    }

    // ensure --output-name is specified adequately
    if (!outputName.match(/^[a-z_]\w*$/)) {
      throw new Error(`Provided output name \`${outputName}\` is not a valid constant or function name in elm.`);
    }
    if (['init', 'main', 'program', 'sendOutput', 'worker'].includes(outputName)) {
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
    const compileOptions = {
      pathToElm,
      report: report === 'normal' ? undefined : report
    };

    const mainModuleJsCode = (await compileToString([mainModuleFilename], compileOptions))
      .toString();

    // run compiled elm file
    const result = {
      output: '',
      debugLog: [],
    };

    // Collect Debug.log messages
    console.log = (...args) => result.debugLog.push(args.join(' '));

    // Disable "Compiled in DEV mode" warning in stdout
    console.warn = noop;

    await new Promise((resolve) => {
      // Evaluate mainModuleJsCode by passing evalContext to it as 'this'.
      // Without this trick, tests fail as 'this' is undefined.
      const evalContext = {};

      // eslint-disable-next-line no-eval,func-names
      (function () { return eval(mainModuleJsCode); }).call(evalContext);
      const worker = evalContext.Elm[mainModule];
      const app = needArgs ? worker.init({ flags: argsToOutput }) : worker.init();
      app.ports.sendOutput.subscribe((output) => {
        result.output = output;
        resolve();
      });
    });
    return result;
  } catch (err) {
    // handle error
    let message;
    if (typeof err === 'object' && 'message' in err) {
      if (err.message.match(/Compilation failed/)) {
        message = err.message
          .replace(/\s*\[[= ]+\] - \d+ \/ \d+\s*/, '\n')
          .replace(/\s*Dependencies loaded from local cache\.\s*/, '')
          .replace(/\s*Dependencies ready!\s*/, '')
          .replace(/\s*Verifying dependencies\.\.\.\s*/, '')
          .replace(/\s*Building dependencies( \(\d+\/\d+\))?\s*/g, '')
          .replace(/\s*Detected errors in \d+ modules?\.\s*/, '')
          .replace(/Compilation failed--/, 'Compilation failed\n--')
          .replace(/\s+$/, '');
      } else if (err.message.indexOf(`does not expose \`${outputName}\``) !== -1) {
        message = `Elm file \`${userModulePath}\` does not define \`${outputName}\`.`;
      } else if (err.message.indexOf(`I cannot find module '${userModule}'`) !== -1) {
        message = `Elm file \`${userModulePath}\` cannot be reached from project dir \`${resolvedProjectDir}\`. Have you configured \`source-directories\` in elm.json?`;
      } else {
        message = err.message;
      }
    } else {
      message = err;
    }
    err.message = message && process.platform === 'win32'
      ? message.replace(/\r\n/g, '\n').replace(/\r/g, ' ')
      : message;
    throw err;
  } finally {
    // cleanup
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    await unlink(mainModuleFilename).catch(noop);
  }
};
