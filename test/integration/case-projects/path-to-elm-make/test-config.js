const path = require('path');

const elmMakeFilename = process.platform === 'win32' ? 'elm-make.bat' : 'elm-make.sh';

module.exports = [{
  title: 'not defiled',
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'defined correctly',
  functionArgs: ['Main.elm', { pathToElmMake: path.resolve(__dirname, '../../', elmMakeFilename) }],
  cliArgs: ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../', elmMakeFilename)],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'defined as non-existing',
  functionArgs: ['Main.elm', { pathToElmMake: path.resolve(__dirname, '../../elm-make42') }],
  cliArgs: ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../elm-make42')],
  expectedExitCode: 1,
}, {
  title: 'defined as directory path',
  functionArgs: ['Main.elm', { pathToElmMake: path.resolve(__dirname, '../../') }],
  cliArgs: ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../')],
  expectedExitCode: 1,
}];
