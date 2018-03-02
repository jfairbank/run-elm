module.exports = [{
  args: ['Main.elm'],
  expectedStdout: '!\n',
}, {
  args: ['Main.elm', 'hello'],
  expectedStdout: 'hello!\n',
}, {
  args: ['Main.elm', 'hello', 'world'],
  expectedStdout: 'hello-world!\n',
}, {
  args: ['Main.elm', 'hello', 'world', '42'],
  expectedStdout: 'hello-world-42!\n',
}];
