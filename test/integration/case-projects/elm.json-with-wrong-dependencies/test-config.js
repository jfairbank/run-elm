const homeDir = require('os').homedir();

const elmDir = process.platform === 'win32'
  ? `${homeDir}\\AppData\\Roaming\\elm`.replace(/\\/g, '\\\\')
  : `${homeDir}/.elm`;
const elmDirInJson = elmDir.replace(/\\/g, '\\\\');

// The value for elmDir may vary in length, which may affect line endings in error messages.
// Soft line breaks in regexps are replaced with _ for code readability.
const _ = '(\\s|\\\\n)';

module.exports = [
  {
    title: 'default',
    functionArgs: ['Main.elm'],
    cliArgs: ['Main.elm'],
    cleanElmStuff: true,
    expectedExitCode: 1,
    expectedError: `Compilation failed
-- INCOMPATIBLE DEPENDENCIES ------------------------------------------ elm.json

The dependencies in your elm.json are not compatible.

Did you change them by hand? Try to change it back! It is much more reliable to
add dependencies with elm install or the dependency management tool in
elm reactor.

Please ask for help on the community forums if you try those paths and are still
having problems!`
  },
  {
    title: 'report=json',
    functionArgs: ['Main.elm', { report: 'json' }],
    cliArgs: ['Main.elm', '--report=json'],
    cleanElmStuff: true,
    expectedExitCode: 1,
    expectedError: `Compilation failed
{"type":"error","path":"elm.json","title":"INCOMPATIBLE DEPENDENCIES","message":["The dependencies in your elm.json are not compatible.\\n\\nDid you change them by hand? Try to change it back! It is much more reliable to\\nadd dependencies with ",{"bold":false,"underline":false,"color":"GREEN","string":"elm install"}," or the dependency management tool in\\n",{"bold":false,"underline":false,"color":"GREEN","string":"elm reactor"},".\\n\\nPlease ask for help on the community forums if you try those paths and are still\\nhaving problems!"]}`
  }
];
