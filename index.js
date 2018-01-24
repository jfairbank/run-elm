#!/usr/bin/env node

import program from 'commander';
import { stat, readFile, writeFile, unlink } from 'fs-extra';
import { compileToString } from 'node-elm-compiler';
import path from 'path';
import sh from 'shelljs';

(async () => {
  program
    // package is one level up because the compiled js file is in lib/
    // eslint-disable-next-line import/no-unresolved
    .version(require(path.resolve(__dirname, '../package.json')).version)
    .usage('[options] <file>')
    .option(
      '--output-var [name]',
      'name of the elm variable to output (should be of type String)',
      'output'
    )
    .option(
      '--project-dir [path]',
      'specific directory in which to search for elm-package.json or to create it (if different from file location)'
    )
    .parse(process.argv);

  // run-elm expect exactly one argument, so exit otherwise
  if (program.args.length !== 1) {
    console.log(program.help());
    process.exit(1);
  }

  // read args and options
  const rawUserModuleFileName = program.args[0];
  const outputVarName = program.outputVar;
  const rawProjectDir = program.projectDir;

  // extract key paths
  const timestamp = +new Date();
  const mainModule = `RunElmMain${timestamp}`;
  const templatePath = path.resolve(__dirname, 'RunElmMain.elm.template');
  const userModulePath = path.resolve(rawUserModuleFileName);
  const userModule = path.basename(userModulePath, '.elm');
  const projectDir = rawProjectDir
    ? path.resolve(rawProjectDir)
    : path.resolve(path.dirname(userModulePath));
  const mainModuleFilename = path.join(projectDir, `${mainModule}.elm`);
  const outputCompiledFilename = path.join(projectDir, `run-elm-main-${timestamp}.js`);

  try {
    // ensure elm is installed
    if (!sh.which('elm')) {
      throw new Error('No elm global binary available. Please install with `npm install -g elm`.');
    }

    // ensure --output-var is specified adequately
    if (!outputVarName.match(/^[a-z_]\w*$/)) {
      throw new Error(
        `Provided --output-var \`${outputVarName}\` is not a valid variable name in elm.`
      );
    }

    // ensure user moule path is adequate
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
      throw new Error(
        `File \`${userModulePath}\` must be located within --project-dir \`${rawProjectDir}\``
      );
    }

    // read RunElmMain template
    await sh.cd(projectDir);
    let template;
    try {
      template = await readFile(templatePath, 'utf-8');
    } catch (err) {
      throw new Error(`Elm file '${templatePath}' does not exist`);
    }

    // create RunELmMain file from template
    const mainModuleContents = template
      .replace('{mainModule}', mainModule)
      .replace('{userModule}', userModule)
      .replace('{output}', outputVarName);
    await writeFile(mainModuleFilename, mainModuleContents, 'utf-8');

    // compile main module
    const contents = await compileToString([mainModuleFilename], { yes: true });
    await writeFile(outputCompiledFilename, contents);

    // run compiled elm file
    await new Promise((resolve) => {
      const { worker } = require(outputCompiledFilename)[mainModule];
      worker().ports.sendOutput.subscribe((output) => {
        console.log(output);
        resolve();
      });
    });
  } catch (err) {
    // handle error
    let message;
    if (typeof err === 'object' && 'message' in err) {
      if (err.message.indexOf(`does not expose \`${outputVarName}\``) !== -1) {
        message = `Elm file \`${userModulePath}\` does not define a String \`${outputVarName}\` variable`;
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
    process.exit(1);
  } finally {
    // cleanup
    Promise.all([
      unlink(mainModuleFilename).catch(() => {}),
      unlink(outputCompiledFilename).catch(() => {})
    ]);
  }
})();
