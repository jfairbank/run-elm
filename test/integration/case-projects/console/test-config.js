module.exports = [
  {
    title: 'Debug.log (single)',
    functionArgs: ['DebugLogSingle.elm'],
    cliArgs: ['DebugLogSingle.elm'],
    expectedOutput: 'Debugging: "hello world"\nhello world',
    expectedError: ''
  },
  {
    title: 'Debug.log (multiple)',
    functionArgs: ['DebugLogMultiple.elm'],
    cliArgs: ['DebugLogMultiple.elm'],
    expectedOutput: `value: 1
for n: 1
value: 1
for n: 2
value: 2
for n: 3
value: 6
for n: 4
value: 24
for n: 5
value: 120
for n: 6
value: 720
for n: 7
value: 5040
for n: 8
value: 40320
for n: 9
value: 362880
for n: 10
3628800`,
    expectedError: ''
  }
];
