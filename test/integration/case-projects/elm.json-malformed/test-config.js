module.exports = [
  {
    title: 'default',
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    expectedExitCode: 1,
    expectedOutput: '',
    expectedError: new RegExp(`Compilation failed
-- EXPECTING A VALUE -------------------------------------------------- elm.json

I ran into a problem with your elm.json file. I was expecting to see a JSON
value next:\\s*elm: Prelude.last: empty list`) // Spacing after "value next:" is unstable. Looks like an upstream issue in Elm 0.19.1.
  },
  {
    title: 'report=json',
    functionArgs: ['Main.elm', { report: 'json' }],
    cliArgs: ['Main.elm', '--report=json'],
    expectedExitCode: 1,
    expectedOutput: '',
    expectedError:
      'Compilation failed\nelm: Prelude.last: empty list' // JSON not returned. Looks like an upstream issue in Elm 0.19.1.
  }
];
