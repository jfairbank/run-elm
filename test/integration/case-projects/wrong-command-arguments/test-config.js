module.exports = [{
  title: 'report=hello',
  args: ['Main.elm', '--report=hello'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: 'Error: It is not allowed to use `hello` as a value for --report. Please use `normal` or `json`.\n',
}, {
  title: 'output-name=123',
  args: ['Main.elm', '--output-name=123'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: 'Error: Provided --output-name `123` is not a valid constant or function name in elm.\n',
}, {
  title: 'output-name=program (reserved word)',
  args: ['Main.elm', '--output-name=program'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: 'Error: It is not allowed to use `program` as a value for --output-name. Please rename the variable you would like to output.\n',
}, {
  title: 'project-dir=/42 (non-existing)',
  args: ['Main.elm', '--project-dir=/42'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: 'Error: Provided --project-dir `/42` is not a directory.\n',
}, {
  title: 'non-existing module',
  args: ['NonExisting.elm'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: () => `Error: File \`${__dirname}/NonExisting.elm\` does not exist.\n`,
}, {
  title: 'non-elm file',
  args: ['test-config.js'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: () => `Error: File \`${__dirname}/test-config.js\` should have .elm file extension.\n`,
}];
