const path = require('path');

module.exports = [{
  title: 'not defiled',
  args: () => ['Main.elm'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'defined correctly',
  args: () => ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../elm-make.sh')],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'defined as non-existing',
  args: () => ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../elm-make.sh42')],
  expectedExitCode: 1,
}, {
  title: 'defined as directory path',
  args: () => ['Main.elm', '--path-to-elm-make', path.resolve(__dirname, '../../')],
  expectedExitCode: 1,
}];
