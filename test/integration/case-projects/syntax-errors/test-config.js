module.exports = [{
  title: 'report=normal (implicit, cold start)',
  args: ['Main.elm'],
  cleanElmStuff: true,
  expectedStdout: '',
  expectedExitCode: 1,
  // do not check stderr as it is unstable (order of downloads changes)
  // approximate stdout:

/*

Error: Compilation failed
Starting downloads...

  ● elm-lang/html 2.0.0
  ● elm-lang/virtual-dom 2.0.4

● elm-lang/core 5.1.1
Packages configured successfully!
-- SYNTAX PROBLEM ------------------------------------------------- ././Main.elm

It looks like the keyword \`module\` is being used as a variable.

4| I am a broken Elm module
                           ^
Rename it to something else.

Detected errors in 1 module.

*/

}, {
  title: 'report=normal (implicit)',
  args: ['Main.elm'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
-- SYNTAX PROBLEM ------------------------------------------------- ././Main.elm

It looks like the keyword \`module\` is being used as a variable.

4| I am a broken Elm module
                           ^
Rename it to something else.

Detected errors in 1 module.

`,
}, {
  title: 'report=normal (explicit)',
  args: ['Main.elm', '--report=normal'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
-- SYNTAX PROBLEM ------------------------------------------------- ././Main.elm

It looks like the keyword \`module\` is being used as a variable.

4| I am a broken Elm module
                           ^
Rename it to something else.

Detected errors in 1 module.

`,
}, {
  title: 'report=json',
  args: ['Main.elm', '--report=json'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
[{"tag":"SYNTAX PROBLEM","overview":"It looks like the keyword \`module\` is being used as a variable.","subregion":null,"details":"Rename it to something else.","region":{"start":{"line":4,"column":25},"end":{"line":4,"column":25}},"type":"error","file":"././Main.elm"}]

`,
}];