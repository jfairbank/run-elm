const path = require('path');

module.exports = [{
  title: 'report=normal (implicit, cold start)',
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
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
  functionArgs: ['Main.elm'],
  cliArgs: ['Main.elm'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
-- SYNTAX PROBLEM ------------------------------------------------- .${path.sep}.${path.sep}Main.elm

It looks like the keyword \`module\` is being used as a variable.

4| I am a broken Elm module
                           ^
Rename it to something else.

Detected errors in 1 module.

`,
}, {
  title: 'report=normal (explicit)',
  functionArgs: ['Main.elm', { report: 'normal' }],
  cliArgs: ['Main.elm', '--report=normal'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: `Error: Compilation failed
-- SYNTAX PROBLEM ------------------------------------------------- .${path.sep}.${path.sep}Main.elm

It looks like the keyword \`module\` is being used as a variable.

4| I am a broken Elm module
                           ^
Rename it to something else.

Detected errors in 1 module.

`,
}, {
  title: 'report=json',
  functionArgs: ['Main.elm', { report: 'json' }],
  cliArgs: ['Main.elm', '--report=json'],
  expectedExitCode: 1,
  expectedStdout: '',
  expectedStderr: process.platform === 'win32'
    ? `Error: Compilation failed
[{"subregion":null,"details":"Rename it to something else.","region":{"end":{"column":25,"line":4},"start":{"column":25,"line":4}},"type":"error","file":".\\\\.\\\\Main.elm","tag":"SYNTAX PROBLEM","overview":"It looks like the keyword \`module\` is being used as a variable."}]

` : `Error: Compilation failed
[{"tag":"SYNTAX PROBLEM","overview":"It looks like the keyword \`module\` is being used as a variable.","subregion":null,"details":"Rename it to something else.","region":{"start":{"line":4,"column":25},"end":{"line":4,"column":25}},"type":"error","file":"././Main.elm"}]

`,
}];
