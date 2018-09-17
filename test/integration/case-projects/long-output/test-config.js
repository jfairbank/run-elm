module.exports = [
  {
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    expectedOutput: () => '\nstatic output'.repeat(1000000).substring(1),
    expectedError: ''
  }
];
