module.exports = [
  {
    title: 'default',
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    expectedExitCode: 1,
    expectedOutput: '',
    expectedError: `Compilation failed
-- BAD JSON ----------------------------------------------------------- elm.json

Something went wrong while parsing your code.

1| oops
   ^
I was expecting:

  - the \`false\` keyword
  - the \`null\` keyword
  - the \`true\` keyword
  - a left square bracket, for starting lists
  - a left curly brace, for starting records

`
  },
  {
    title: 'report=json',
    functionArgs: ['Main.elm', { report: 'json' }],
    cliArgs: ['Main.elm', '--report=json'],
    expectedExitCode: 1,
    expectedOutput: '',
    expectedError:
      'Compilation failed\n{"type":"error","path":"elm.json","title":"BAD JSON","message":["Something went wrong while parsing your code.\\n\\n1| oops\\n   ",{"bold":false,"underline":false,"color":"red","string":"^"},"\\nI was expecting:\\n\\n  - the `false` keyword\\n  - the `null` keyword\\n  - the `true` keyword\\n  - a left square bracket, for starting lists\\n  - a left curly brace, for starting records"]}'
  }
];
