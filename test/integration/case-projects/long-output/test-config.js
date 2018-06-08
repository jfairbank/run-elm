module.exports = [{
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
  expectedStdout: () => 'static output\n'.repeat(1000000),
  expectedStderr: '',
}];
