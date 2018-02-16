#!/usr/bin/env node

import program from 'commander';
import { stat, readFile, writeFile, unlink } from 'fs-extra';
import { compileToString } from 'node-elm-compiler';
import path from 'path';
import sh from 'shelljs';

(async () => {
  program
    // package.json is one level up because the compiled js file is in lib/
    // eslint-disable-next-line import/no-unresolved
    .version(require(path.resolve(__dirname, '../package.json')).version)
    .usage('[options] <file> [arg1 arg2 ...]')
    .description('Runs an Elm file and prints the result of `output` to stdout.'
      + ' `output` can be a constant of type `String` or a function that accepts `List String` and returns `String`. You can supply command line arguments to the Elm file if `output` accepts `List String`.')
    .option(
      '--output-name [name]',
      'constant or function name for printing results',
      'output',
    )
    .option(
      '--project-dir [path]',
      'specific directory to search for elm-package.json or to create it (if different from Elm file location)'
    )
    .parse(process.argv);

  // run-elm expects one or more arguments, so exit if no arguments given
  if (program.args.length === 0) {
    console.log(program.help());
    process.exit(1);
  }

  // read args and options
  const rawUserModuleFileName = program.args[0];
  const outputName = program.outputName;
  const rawProjectDir = program.projectDir;
  const argsToOutput = program.args.slice(1);

  // extract key paths
  const timestamp = +new Date();
  const mainModule = `RunElmMain${timestamp}`;
  const templatePath = path.resolve(__dirname, 'RunElmMain.elm.template');
  const templateWithArgsPath = path.resolve(__dirname, 'RunElmMainWithArgs.elm.template');
  const userModulePath = path.resolve(rawUserModuleFileName);
  const userModule = path.basename(userModulePath, '.elm');
  const projectDir = rawProjectDir
    ? path.resolve(rawProjectDir)
    : path.resolve(path.dirname(userModulePath));
  const mainModuleFilename = path.join(projectDir, `${mainModule}.elm`);
  const outputCompiledFilename = path.join(projectDir, `run-elm-main-${timestamp}.js`);

  let exitCode = 0;
  try {
    // ensure elm is installed
    if (!sh.which('elm')) {
      throw new Error('No elm global binary available. Please install with `npm install -g elm`.');
    }

    // ensure --output-name is specified adequately
    if (!outputName.match(/^[a-z_]\w*$/)) {
      throw new Error(`Provided --output-name \`${outputName}\` is not a valid constant or function name in elm.`);
    }
    if (['init', 'main', 'program', 'sendOutput'].includes(outputName)) {
      throw new Error(`It is not allowed to use \`${outputName}\` as a value for --output-name. Please rename the variablue you would like to output.`);
    }

    // ensure user module path is adequate
    try {
      const userModuleFileStats = await stat(userModulePath);
      if (!userModuleFileStats.isFile()) {
        throw new Error();
      }
    } catch (err) {
      throw new Error(`File '${userModulePath}' does not exist`);
    }
    if (!userModulePath.match(/\.elm$/i, '')) {
      throw new Error(`File '${userModulePath}' should have .elm file extension`);
    }

    // ensure project folder is adequate
    try {
      const projectDirStats = await stat(projectDir);
      if (!projectDirStats.isDirectory()) {
        throw new Error();
      }
    } catch (err) {
      throw new Error(`Provided --project-dir '${rawProjectDir}' is not a directory`);
    }
    if (userModulePath.indexOf(`${projectDir}/`) !== 0) {
      throw new Error(`File \`${userModulePath}\` must be located within --project-dir \`${rawProjectDir}\``);
    }

    // read user module and determine what template to use
    let userModuleContents;
    try {
      userModuleContents = await readFile(userModulePath, 'utf-8');
    } catch (err) {
      throw new Error(`File '${userModulePath}' could not be read`);
    }
    const argsRegex = new RegExp(`^${outputName} +\\w+ *=`);
    const needArgs = userModuleContents
      .split('\n')
      .some(line => argsRegex.test(line.trim()));

    // read main module template
    sh.cd(projectDir);
    let template;
    const chosenTemplatePath = needArgs ? templateWithArgsPath : templatePath;
    try {
      template = await readFile(chosenTemplatePath, 'utf-8');
    } catch (err) {
      throw new Error(`Elm file '${chosenTemplatePath}' does not exist`);
    }

    // create main module file from template
    const mainModuleContents = template
      .replace('{mainModule}', mainModule)
      .replace('{userModule}', userModule)
      .replace(/\{output\}/g, outputName);
    await writeFile(mainModuleFilename, mainModuleContents, 'utf-8');

    // compile main module
    const contents = await compileToString([mainModuleFilename], { yes: true });
    await writeFile(outputCompiledFilename, contents);

    // run compiled elm file
    await new Promise((resolve) => {
      const { worker } = require(outputCompiledFilename)[mainModule];
      const app = needArgs ? worker(argsToOutput) : worker();
      app.ports.sendOutput.subscribe((output) => {
        console.log(output);
        resolve();
      });
    });
  } catch (err) {
    // handle error
    let message;
    if (typeof err === 'object' && 'message' in err) {
      if (err.message.indexOf(`does not expose \`${outputName}\``) !== -1) {
        message = `Elm file \`${userModulePath}\` does not define \`${outputName}\``;
      } else if (err.message.indexOf(`I cannot find module '${userModule}'`) !== -1) {
        message = `Elm file \`${userModulePath}\` cannot be reached from --project-dir \`${projectDir}\`. Have you configured \`source-directories\` in elm-package.json?`;
      } else {
        message = err.message;
      }
    } else {
      message = err;
    }
    console.error('Error:', message);
    if (err.stack && process.env.DEBUG) {
      console.error(err.stack.substring(err.toString().length + 1));
    }
    exitCode = 1;
  } finally {
    // cleanup
    await Promise.all([
      unlink(mainModuleFilename).catch(() => {}),
      unlink(outputCompiledFilename).catch(() => {})
    ]);
  }

  // do not call process.exit(0) to avoid stdout truncation
  // https://github.com/nodejs/node/issues/6456
  if (exitCode) {
    process.exit(exitCode);
  }
})();
