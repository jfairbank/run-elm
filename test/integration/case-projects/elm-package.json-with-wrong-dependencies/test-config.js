module.exports = [{
  title: 'default',
  args: ['Main.elm'],
  cleanElmStuff: true,
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
Error: Your .elm/packages/ directory may be corrupted. I was led to believe that
dev/null existed, but I could not find anything when I went to look up the
published versions of this package.



`,
}, {
  title: 'report=json',
  args: ['Main.elm', '--report=json'],
  cleanElmStuff: true,
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
Error: Your .elm/packages/ directory may be corrupted. I was led to believe that
dev/null existed, but I could not find anything when I went to look up the
published versions of this package.



`,
}];
