const path = require('path');

module.exports = [{
  title: 'report=hello',
  functionArgs: ['Main.elm', { report: 'hello' }],
  cliArgs: ['Main.elm', '--report=hello'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: 'Error: It is not allowed to use `hello` as a value for report. Please use `normal` or `json`.\n',
}, {
  title: 'output-name=123',
  functionArgs: ['Main.elm', { outputName: '123' }],
  cliArgs: ['Main.elm', '--output-name=123'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: 'Error: Provided output name `123` is not a valid constant or function name in elm.\n',
}, {
  title: 'output-name=program (reserved word)',
  functionArgs: ['Main.elm', { outputName: 'program' }],
  cliArgs: ['Main.elm', '--output-name=program'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: 'Error: It is not allowed to use `program` as a value for output name. Please rename the symbol you would like to output.\n',
}, {
  title: 'project-dir=/42 (non-existing)',
  functionArgs: ['Main.elm', { projectDir: '/42' }],
  cliArgs: ['Main.elm', '--project-dir=/42'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Provided project dir \`${path.resolve('/42')}\` is not a directory.\n`,
}, {
  title: 'non-existing module',
  functionArgs: ['NonExisting.elm'],
  cliArgs: ['NonExisting.elm'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: () => `Error: File \`${path.resolve(__dirname, 'NonExisting.elm')}\` does not exist.\n`,
}, {
  title: 'non-elm file',
  functionArgs: ['test-config.js'],
  cliArgs: ['test-config.js'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: () => `Error: File \`${path.resolve(__dirname, 'test-config.js')}\` should have .elm file extension.\n`,
}];
