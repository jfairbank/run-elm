const path = require('path');

module.exports = [{
  title: 'not defiled',
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'defined correctly',
  functionArgs: ['Main.elm', { pathToElmMake: path.resolve(__dirname, '../../elm-make.sh') }],
  cliArgs: ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../elm-make.sh')],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'defined as non-existing',
  functionArgs: ['Main.elm', { pathToElmMake: path.resolve(__dirname, '../../elm-make.sh42') }],
  cliArgs: ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../elm-make.sh42')],
  expectedExitCode: 1,
}, {
  title: 'defined as directory path',
  functionArgs: ['Main.elm', { pathToElmMake: path.resolve(__dirname, '../../') }],
  cliArgs: ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../')],
  expectedExitCode: 1,
}];
