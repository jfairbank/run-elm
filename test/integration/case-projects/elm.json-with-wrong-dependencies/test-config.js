const homeDir = require('os').homedir();

const elmDir = process.platform === 'win32'
  ? `${homeDir}\\AppData\\Roaming\\elm`.replace(/\\/g, '\\\\')
  : `${homeDir}/.elm`;
const elmDirInJson = elmDir.replace(/\\/, '\\\\');

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
    expectedError: new RegExp(`Compilation failed
-- CORRUPT CACHE ---------------------------------------------------------------

I ran into an unknown package while exploring dependencies:

    dev\\/null

This suggests that your ${elmDir}${_}directory${_}has${_}been${_}corrupted.${_}Maybe${_}some${_}program${_}is${_}messing${_}with${_}it\\?${_}It${_}is${_}just${_}cached${_}files,${_}so${_}you${_}can${_}delete${_}it${_}and${_}see${_}if${_}that${_}fixes${_}the${_}issue\\.`)
  },
  {
    title: 'report=json',
    functionArgs: ['Main.elm', { report: 'json' }],
    cliArgs: ['Main.elm', '--report=json'],
    cleanElmStuff: true,
    expectedExitCode: 1,
    expectedError: new RegExp(`^Compilation failed
{"type":"error","path":null,"title":"CORRUPT CACHE","message":\\["I ran into an unknown package while exploring dependencies:\\\\n\\\\n    ",{"bold":false,"underline":false,"color":"yellow","string":"dev\\/null"},"\\\\n\\\\nThis suggests that your ${elmDirInJson}${_}directory${_}has${_}been${_}corrupted.${_}Maybe${_}some${_}program${_}is${_}messing${_}with${_}it\\?${_}It${_}is${_}just${_}cached${_}files,${_}so${_}you${_}can${_}delete${_}it${_}and${_}see${_}if${_}that${_}fixes${_}the${_}issue\\."\\]}$`)
  }
];
