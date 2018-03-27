module.exports = [{
  args: ['Main.elm'],
  expectedStdout: () => 'static output\n'.repeat(1000000),
  expectedStderr: '',
}];
