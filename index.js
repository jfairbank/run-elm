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

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const runModuleName = 'RunElmMain';
const templatePath = path.resolve(__dirname, `${runModuleName}.elm.template`);

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

function getTemplate() {
  return readFile(templatePath, 'utf-8');
}

function createElmFile(template) {
  const contents = template.replace('{module}', moduleName);
  return writeFile(outputElmFilename, contents, 'utf-8');
}

function compileElmFile() {
  sh.cd(outputDir);

  return compileToString([outputElmFilename], { yes: true })
    .then(contents => writeFile(outputCompiledFilename, contents));
}

function runElmFile() {
  return new Promise((resolve) => {
    const { worker } = require(outputCompiledFilename)[runModuleName];

    worker().ports.sendOutput.subscribe((output) => {
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

stat(filename)
  .then(
    getTemplate,
    () => Promise.reject(`Elm file '${filename}' does not exist`)
  )
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
