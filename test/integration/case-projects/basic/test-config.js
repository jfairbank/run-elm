module.exports = [
  {
    title: 'minimal example',
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    expectedOutput: 'static output',
    expectedError: ''
  },
  {
    title: 'superfluous arguments',
    functionArgs: ['Main.elm', { argsToOutput: ['superfluous', 'arguments'] }],
    cliArgs: ['Main.elm', 'superfluous', 'arguments'],
    expectedOutput: 'static output',
    expectedError: ''
  }
];
