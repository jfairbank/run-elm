#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { compileToString } from 'node-elm-compiler';
import sh from 'shelljs';

const filename = (process.argv[2] || '').trim();

if (!filename || filename === '-h' || filename === '--help') {
  console.log('Usage: run-elm [FILENAME]');
  process.exit(1);
}

if (!sh.which('elm')) {
  console.error('Error: No elm global binary available. Please install with `npm install -g elm`.');
  process.exit(1);
}

function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const runModuleName = 'RunElmMain';
const templatePath = path.resolve(__dirname, `${runModuleName}.elm.template`);
const templateWithArgsPath = path.resolve(__dirname, `${runModuleName}Args.elm.template`);

const moduleName = path.basename(filename, '.elm');
const outputDir = path.resolve(path.dirname(filename));
const outputElmFilename = path.join(outputDir, `${runModuleName}.elm`);
const outputCompiledFilename = path.join(outputDir, 'run-elm-main.js');

function cleanup() {
  return Promise.all([
    unlink(outputElmFilename).catch(() => {}),
    unlink(outputCompiledFilename).catch(() => {}),
  ]);
}

function determineNeedArgs(contents) {
  const argsRegex = /^output *\w+ *=/;

  return contents
    .split('\n')
    .some(line => argsRegex.test(line.trim()));
}

function getTemplate(needArgs) {
  const templateFile = needArgs
    ? templateWithArgsPath
    : templatePath;

  return readFile(templateFile, 'utf-8')
    .then(template => ({ template, needArgs }));
}

function createElmFile(config) {
  const contents = config.template.replace('{module}', moduleName);
  return writeFile(outputElmFilename, contents, 'utf-8')
    .then(() => config);
}

function compileElmFile(config) {
  sh.cd(outputDir);

  return compileToString([outputElmFilename], { yes: true })
    .then(contents => writeFile(outputCompiledFilename, contents))
    .then(() => config);
}

function runElmFile(config) {
  return new Promise((resolve) => {
    const { worker } = require(outputCompiledFilename)[runModuleName];
    let app;

    if (config.needArgs) {
      const args = process.argv.slice(3);
      app = worker(args);
    } else {
      app = worker();
    }

    app.ports.sendOutput.subscribe((output) => {
      console.log(output);
      resolve();
    });
  });
}

function handleError(err) {
  let message;

  if (typeof err === 'object' && 'message' in err) {
    if (/does not expose `output`/.test(err.message)) {
      message = `Elm module \`${moduleName}\` does not define a String \`output\` variable.`;
    } else {
      message = err.message;
    }
  } else {
    message = err;
  }

  console.error('Error:', message);
}

readFile(filename, 'utf-8')
  .then(
    determineNeedArgs,
    () => Promise.reject(`Elm file '${filename}' does not exist`)
  )
  .then(getTemplate)
  .then(createElmFile)
  .then(compileElmFile)
  .then(runElmFile)
  .then(cleanup)
  .catch((err) => {
    cleanup().then(() => {
      handleError(err);
      process.exit(1);
    });
  });
