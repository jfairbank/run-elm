const path = require('path');

const normalError = `Compilation failed
-- PARSE ERROR ------------------------------------------------------ .${path.sep}Main.elm

Something went wrong while parsing hello's type annotation.

3| hello: world
4| I am a broken Elm module
   ^
I was expecting:

  - a declaration, like \`x = 5\` or \`type alias Model = { ... }\`
  - the rest of hello's type annotation. Maybe you forgot some code? Or you need
    more indentation?`;

module.exports = [
  {
    title: 'report=normal (implicit)',
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    expectedExitCode: 1,
    expectedOutput: '',
    expectedError: normalError
  },
  {
    title: 'report=normal (explicit)',
    functionArgs: ['Main.elm', { report: 'normal' }],
    cliArgs: ['Main.elm', '--report=normal'],
    expectedExitCode: 1,
    expectedOutput: '',
    expectedError: normalError
  },
  {
    title: 'report=json',
    functionArgs: ['Main.elm', { report: 'json' }],
    cliArgs: ['Main.elm', '--report=json'],
    expectedExitCode: 1,
    expectedOutput: '',
    expectedError: `Compilation failed
{"type":"compile-errors","errors":[{"path":"./Main.elm","name":"Main","problems":[{"title":"PARSE ERROR","region":{"start":{"line":4,"column":1},"end":{"line":4,"column":1}},"message":["Something went wrong while parsing hello's type annotation.\\n\\n3| hello: world\\n4| I am a broken Elm module\\n   ",{"bold":false,"underline":false,"color":"red","string":"^"},"\\nI was expecting:\\n\\n  - a declaration, like \`x = 5\` or \`type alias Model = { ... }\`\\n  - the rest of hello's type annotation. Maybe you forgot some code? Or you need\\n    more indentation?"]}]}]}`
    // process.platform === 'win32'
    // ? `` :
  }
];
