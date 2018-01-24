#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { compileToString } from 'node-elm-compiler';
import sh from 'shelljs';
import util from 'util';

const elmFilename = (process.argv[2] || '').trim();

if (!elmFilename || elmFilename === '-h' || elmFilename === '--help') {
  console.log('Usage: run-elm [FILENAME]');
  process.exit(1);
}

if (!sh.which('elm')) {
  console.error('Error: No elm global binary available. Please install with `npm install -g elm`.');
  process.exit(1);
}

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

const runModuleName = 'RunElmMain';
const templatePath = path.resolve(__dirname, `${runModuleName}.elm.template`);
const templateWithArgsPath = path.resolve(__dirname, `${runModuleName}Args.elm.template`);

const moduleName = path.basename(elmFilename, '.elm');
const outputDir = path.resolve(path.dirname(elmFilename));
const outputElmFilename = path.join(outputDir, `${runModuleName}.elm`);
const outputCompiledFilename = path.join(outputDir, 'run-elm-main.js');

function getElmFileContents() {
  return readFile(elmFilename, 'utf-8')
    .catch(
      () => Promise.reject(`Elm file '${elmFilename}' does not exist`)
    );
}

function determineNeedArgs(elmFileContents) {
  const argsRegex = /^output *\w+ *=/;

  return elmFileContents
    .split('\n')
    .some(line => argsRegex.test(line.trim()));
}

function getTemplate(needArgs) {
  const templateFile = needArgs
    ? templateWithArgsPath
    : templatePath;

  return readFile(templateFile, 'utf-8');
}

function createElmFile(template) {
  const contents = template.replace('{module}', moduleName);

  return writeFile(outputElmFilename, contents, 'utf-8');
}

async function compileElmFile() {
  sh.cd(outputDir);

  const contents = await compileToString([outputElmFilename], { yes: true });

  return writeFile(outputCompiledFilename, contents);
}

function runElmFile(needArgs) {
  return new Promise((resolve) => {
    const { worker } = require(outputCompiledFilename)[runModuleName];
    let app;

    if (needArgs) {
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

function cleanup() {
  return Promise.all([
    unlink(outputElmFilename).catch(() => {}),
    unlink(outputCompiledFilename).catch(() => {}),
  ]);
}

function handleError(err) {
  let message;

  if (typeof err === 'object' && 'message' in err) {
    if (/does not expose `output`/.test(err.message)) {
      message = `Elm module \`${moduleName}\` does not define a String \`output\`.`;
    } else {
      message = err.message;
    }
  } else {
    message = err;
  }

  console.error('Error:', message);
}

async function main() {
  try {
    const elmFileContents = await getElmFileContents();
    const needArgs = determineNeedArgs(elmFileContents);
    const template = await getTemplate(needArgs);

    await createElmFile(template);
    await compileElmFile();
    await runElmFile(needArgs);
    await cleanup();
  } catch (e) {
    await cleanup();
    handleError(e);
    process.exit(1);
  }
}

main();
