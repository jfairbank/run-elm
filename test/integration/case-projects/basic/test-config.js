module.exports = [{
  title: 'minimal example',
  args: ['Main.elm'],
  expectedStdout: 'static output\n',
}, {
  title: 'non-existing module',
  args: ['NonExistingModule.elm'],
  expectedExitCode: 1,
  expectedStderr: ({ projectDir }) => `Error: File '${projectDir}/NonExistingModule.elm' does not exist\n`,
}];
