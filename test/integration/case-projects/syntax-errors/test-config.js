const path = require('path');

const normalError = `Compilation failed
-- EXPECTING DEFINITION ----------------------------------------------- Main.elm

I just saw the type annotation for \`hello\` so I was expecting to see its
definition here:

3| hello: world
4| I am a broken Elm module
   ^
Type annotations always appear directly above the relevant definition, without
anything else in between. (Not even doc comments!)

Here is a valid definition (with a type annotation) for reference:

    greet : String -> String
    greet name =
      "Hello " ++ name ++ "!"

The top line (called a "type annotation") is optional. You can leave it off if
you want. As you get more comfortable with Elm and as your project grows, it
becomes more and more valuable to add them though! They work great as
compiler-verified documentation, and they often improve error messages!`;

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
{"type":"compile-errors","errors":[{"path":"${__dirname}${path.sep === '\\' ? '\\\\' : '/'}Main.elm","name":"Main","problems":[{"title":"EXPECTING DEFINITION","region":{"start":{"line":4,"column":1},"end":{"line":4,"column":1}},"message":["I just saw the type annotation for \`hello\` so I was expecting to see its\\ndefinition here:\\n\\n3| hello: world\\n4| I am a broken Elm module\\n   ",{"bold":false,"underline":false,"color":"RED","string":"^"},"\\nType annotations always appear directly above the relevant definition, without\\nanything else in between. (Not even doc comments!)\\n\\nHere is a valid definition (with a type annotation) for reference:\\n\\n    greet : String -> String\\n    greet name =\\n      ",{"bold":false,"underline":false,"color":"yellow","string":"\\\"Hello \\\""}," ++ name ++ ",{"bold":false,"underline":false,"color":"yellow","string":"\\\"!\\\""},"\\n\\nThe top line (called a \\\"type annotation\\\") is optional. You can leave it off if\\nyou want. As you get more comfortable with Elm and as your project grows, it\\nbecomes more and more valuable to add them though! They work great as\\ncompiler-verified documentation, and they often improve error messages!"]}]}]}`
  }
];
