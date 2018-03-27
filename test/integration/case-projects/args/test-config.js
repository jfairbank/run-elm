module.exports = [{
  args: ['Main.elm'],
  expectedStdout: '!\n',
  expectedStderr: '',
}, {
  args: ['Main.elm', 'hello'],
  expectedStdout: 'hello!\n',
  expectedStderr: '',
}, {
  args: ['Main.elm', 'hello', 'world'],
  expectedStdout: 'hello-world!\n',
  expectedStderr: '',
}, {
  args: ['Main.elm', 'hello', 'world', '42'],
  expectedStdout: 'hello-world-42!\n',
  expectedStderr: '',
}];
