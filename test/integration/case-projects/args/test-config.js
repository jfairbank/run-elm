module.exports = [{
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
  expectedStdout: '!\n',
  expectedStderr: '',
}, {
  functionArgs: ['Main.elm', {
    argsToOutput: ['hello'],
  }],
  cliArgs: ['Main.elm', 'hello'],
  expectedStdout: 'hello!\n',
  expectedStderr: '',
}, {
  functionArgs: ['Main.elm', {
    argsToOutput: ['hello', 'world'],
  }],
  cliArgs: ['Main.elm', 'hello', 'world'],
  expectedStdout: 'hello-world!\n',
  expectedStderr: '',
}, {
  functionArgs: ['Main.elm', {
    argsToOutput: ['hello', 'world', '42'],
  }],
  cliArgs: ['Main.elm', 'hello', 'world', '42'],
  expectedStdout: 'hello-world-42!\n',
  expectedStderr: '',
}];
