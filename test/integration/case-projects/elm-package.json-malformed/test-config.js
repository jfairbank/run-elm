module.exports = [{
  title: 'default',
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
Error: The description in elm-package.json is not valid.

I cannot parse the JSON. Maybe a comma is missing? Or there is an extra one?
It could also be because of mismatched brackets or quotes.

You can also check out the following example to see what it should look like:
<https://raw.githubusercontent.com/elm-lang/html/master/elm-package.json>



`,
}, {
  title: 'report=json',
  functionArgs: ['Main.elm', { report: 'json' }],
  cliArgs: ['Main.elm', '--report=json'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
Error: The description in elm-package.json is not valid.

I cannot parse the JSON. Maybe a comma is missing? Or there is an extra one?
It could also be because of mismatched brackets or quotes.

You can also check out the following example to see what it should look like:
<https://raw.githubusercontent.com/elm-lang/html/master/elm-package.json>



`,
}];
