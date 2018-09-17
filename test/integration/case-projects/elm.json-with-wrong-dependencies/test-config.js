const homeDir = require('os').homedir();

module.exports = [
  {
    title: 'default',
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    cleanElmStuff: true,
    expectedExitCode: 1,
    expectedError: `Compilation failed
-- CORRUPT CACHE ---------------------------------------------------------------

I ran into an unknown package while exploring dependencies:

    dev/null

This suggests that your ${homeDir}/.elm directory has been corrupted. Maybe some
program is messing with it? It is just cached files, so you can delete it and
see if that fixes the issue.`
  },
  {
    title: 'report=json',
    functionArgs: ['Main.elm', { report: 'json' }],
    cliArgs: ['Main.elm', '--report=json'],
    cleanElmStuff: true,
    expectedExitCode: 1,
    expectedError: `Compilation failed
{"type":"error","path":null,"title":"CORRUPT CACHE","message":["I ran into an unknown package while exploring dependencies:\\n\\n    ",{"bold":false,"underline":false,"color":"yellow","string":"dev/null"},"\\n\\nThis suggests that your ${homeDir}/.elm directory has been corrupted. Maybe some\\nprogram is messing with it? It is just cached files, so you can delete it and\\nsee if that fixes the issue."]}`
  }
];
