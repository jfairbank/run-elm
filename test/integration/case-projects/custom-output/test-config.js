module.exports = [{
  title: 'constant',
  args: ['--output-name=customConstant', 'CustomOutputWithConstant.elm'],
  expectedStdout: 'static output from custom constant\n',
  expectedStderr: '',
}, {
  title: 'function',
  args: ['--output-name=customFunction', 'CustomOutputWithFunction.elm', 'forty', 'two'],
  expectedStdout: 'static output from forty two\n',
  expectedStderr: '',
}];
