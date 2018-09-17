module.exports = [
  {
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    expectedOutput: '!',
    expectedError: ''
  },
  {
    functionArgs: [
      'Main.elm',
      {
        argsToOutput: ['hello']
      }
    ],
    cliArgs: ['Main.elm', 'hello'],
    expectedOutput: 'hello!',
    expectedError: ''
  },
  {
    functionArgs: [
      'Main.elm',
      {
        argsToOutput: ['hello', 'world']
      }
    ],
    cliArgs: ['Main.elm', 'hello', 'world'],
    expectedOutput: 'hello-world!',
    expectedError: ''
  },
  {
    functionArgs: [
      'Main.elm',
      {
        argsToOutput: ['hello', 'world', '42']
      }
    ],
    cliArgs: ['Main.elm', 'hello', 'world', '42'],
    expectedOutput: 'hello-world-42!',
    expectedError: ''
  }
];
