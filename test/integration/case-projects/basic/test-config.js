module.exports = [{
  title: 'minimal example',
  args: ['Main.elm'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'superfluous arguments',
  args: ['Main.elm', 'superfluous', 'arguments'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}];
