const path = require('path');

const elmMakeFilename = process.platform === 'win32' ? 'elm.bat' : 'elm.sh';

module.exports = [
  {
    title: 'not defiled',
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    expectedOutput: 'static output'
  },
  {
    title: 'defined correctly',
    functionArgs: [
      'Main.elm',
      { pathToElm: path.resolve(__dirname, '../../', elmMakeFilename) }
    ],
    cliArgs: [
      'Main.elm',
      '--path-to-elm-make',
      path.resolve(__dirname, '../../', elmMakeFilename)
    ],
    expectedOutput: 'static output'
  },
  {
    title: 'defined as non-existing',
    functionArgs: [
      'Main.elm',
      { pathToElm: path.resolve(__dirname, '../../elm42') }
    ],
    cliArgs: [
      'Main.elm',
      '--path-to-elm-make',
      path.resolve(__dirname, '../../elm42')
    ],
    expectedExitCode: 1
  },
  {
    title: 'defined as directory path',
    functionArgs: [
      'Main.elm',
      { pathToElm: path.resolve(__dirname, '../../') }
    ],
    cliArgs: [
      'Main.elm',
      '--path-to-elm-make',
      path.resolve(__dirname, '../../')
    ],
    expectedExitCode: 1
  }
];
