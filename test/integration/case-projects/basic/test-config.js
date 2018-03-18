module.exports = [{
  title: 'minimal example',
  args: ['Main.elm'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'superfluous arguments',
  args: ['Main.elm', 'superfluous', 'arguments'],
  expectedStdout: 'static output\n',
  expectedStderr: '',
}, {
  title: 'non-existing module',
  args: ['NonExistingModule.elm'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: ({ projectDir }) => `Error: File '${projectDir}/NonExistingModule.elm' does not exist\n`,
}];
