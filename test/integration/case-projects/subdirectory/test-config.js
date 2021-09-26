module.exports = [
  {
    functionArgs: ['src/Main.elm', { projectDir: __dirname }],
    cliArgs: ['--project-dir=.', 'src/Main.elm'],
    expectedOutput: 'static output from subdirectory',
    expectedError: ''
  }
];
