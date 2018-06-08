module.exports = [{
  title: 'constant',
  functionArgs: ['CustomOutputWithConstant.elm', { outputName: 'customConstant' }],
  cliArgs: ['--output-name=customConstant', 'CustomOutputWithConstant.elm'],
  expectedStdout: 'static output from custom constant\n',
  expectedStderr: '',
}, {
  title: 'function',
  functionArgs: ['CustomOutputWithFunction.elm', { outputName: 'customFunction', argsToOutput: ['forty', 'two'] }],
  cliArgs: ['--output-name=customFunction', 'CustomOutputWithFunction.elm', 'forty', 'two'],
  expectedStdout: 'static output from forty two\n',
  expectedStderr: '',
}];
