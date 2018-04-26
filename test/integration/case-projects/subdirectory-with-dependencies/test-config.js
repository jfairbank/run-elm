module.exports = [{
  functionArgs: ['src/Main.elm', { projectDir: __dirname }],
  cliArgs: ['--project-dir=.', 'src/Main.elm'],
  expectedStdout: 'static output from subdirectory with dependencies\n',
  expectedStderr: '',
}];
