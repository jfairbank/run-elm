module.exports = [{
  title: 'default',
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
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
  functionArgs: ['Main.elm', { report: 'json' }],
  cliArgs: ['Main.elm', '--report=json'],
  cleanElmStuff: true,
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
Error: Your .elm/packages/ directory may be corrupted. I was led to believe that
dev/null existed, but I could not find anything when I went to look up the
published versions of this package.



`,
}];
