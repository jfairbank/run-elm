module.exports = [{
  title: 'minimal example',
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'superfluous arguments',
  functionArgs: ['Main.elm', { argsToOutput: ['superfluous', 'arguments'] }],
  cliArgs: ['Main.elm', 'superfluous', 'arguments'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}];
