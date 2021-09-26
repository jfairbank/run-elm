#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import runElm from './index';
import defaultOptions from './defaultOptions';

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
      defaultOptions.outputName,
    )
    .option(
      '--project-dir [path]',
      'specific directory to search for elm-package.json or to create it (if different from Elm file location)'
    )
    .option(
      '--report [format]',
      'format of error and warning reports (e.g. --report=json)',
      defaultOptions.report,
    )
    .option(
      '--path-to-elm-make [path]',
      'location of `elm-make` binary (if not defined, a globally available `elm-make` is used)'
    )
    .parse(process.argv);

  // run-elm expects one or more arguments, so exit if no arguments given
  if (program.args.length === 0) {
    console.log(program.help());
    process.exit(1);
  }

  try {
    const options = program.opts();
    const { debugLog, output } = await runElm(program.args[0], {
      outputName: options.outputName,
      projectDir: options.projectDir,
      report: options.report,
      pathToElmMake: options.pathToElmMake,
      argsToOutput: program.args.slice(1),
    });
    if (debugLog.length) {
      console.log(debugLog.join('\n'));
    }
    console.log(output);
  } catch (e) {
    console.error(e.message);
    if (e.stack && process.env.DEBUG) {
      console.error(e.stack.substring(e.toString().length + 1));
    }
    process.exit(1);
  }
})();
