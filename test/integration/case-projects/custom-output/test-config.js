module.exports = [
  {
    title: 'constant',
    functionArgs: [
      'CustomOutputWithConstant.elm',
      { outputName: 'customConstant' }
    ],
    cliArgs: ['--output-name=customConstant', 'CustomOutputWithConstant.elm'],
    expectedOutput: 'static output from custom constant',
    expectedError: ''
  },
  {
    title: 'function',
    functionArgs: [
      'CustomOutputWithFunction.elm',
      { outputName: 'customFunction', argsToOutput: ['forty', 'two'] }
    ],
    cliArgs: [
      '--output-name=customFunction',
      'CustomOutputWithFunction.elm',
      'forty',
      'two'
    ],
    expectedOutput: 'static output from forty two',
    expectedError: ''
  }
];
