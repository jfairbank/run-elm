# run-elm

[![npm](https://img.shields.io/npm/v/run-elm.svg?style=flat-square)](https://www.npmjs.com/package/run-elm)
[![Travis branch](https://img.shields.io/travis/jfairbank/run-elm/master.svg?style=flat-square&logo=travis)](https://travis-ci.org/jfairbank/run-elm)
[![AppVeyor branch](https://img.shields.io/appveyor/ci/jfairbank/run-elm/master.svg?style=flat-square&logo=appveyor)](https://ci.appveyor.com/project/jfairbank/run-elm)

##### Run Elm code from the command line

Ever want to quickly try out some Elm code that's too complex for the REPL or
too much of a hassle to bootstrap with the Elm architecture and the browser?
run-elm has you covered. run-elm allows you to quickly define a module that you
can run from the command line!

## Prerequisites

run-elm requires Node versions >= 6.

run-elm also expects a current version of the Elm binary installed globally. You can
install it with:

```sh
npm install -g elm
```

## Installation

```sh
$ npm install -g run-elm
```

## Usage

Write some Elm code, ensuring you declare a module name that matches the
filename. Then, add an `output` constant of type `String` for whatever you want
to print to the command line:

```elm
module Hello exposing (..)


output : String
output =
    "Hello World!"
```

Finally, run the code:

```bash
$ run-elm Hello.elm
Hello World!
```

You should see your message printed to the console.

### Command Line Arguments

run-elm also supports command line arguments to `output` as a list of strings.

```elm
module Main exposing (output)


output : List String -> String
output args =
    String.join "-" args ++ "!"
```

Running this:

```bash
run-elm Main.elm hello world
```

Results in this:

```
hello-world!
```

run-elm automatically detects whether `output` is of type `String` or `List String -> String`, so passing no extra arguments to the command will simply make `args` an empty list and will not produce an error.
Similarly, if `output` is `String`, extra command arguments are simply ignored as redundant.

### Customizing Output Name

Specify a custom name for the output constant or function by adding `--output-name=myCustomConstantOrFunction` to the command:

```elm
module Hello exposing (..)


myCustomConstant : String
myCustomConstant =
    "Hello World!"
```

```bash
$ run-elm --output-name=myCustomConstant Hello.elm
Hello World!
```

### Running Modules in Elm Project Subdirectories

By default, run-elm assumes that your Elm module is located in the root of its project directory.
This means that Elm searches for `elm-package.json` and `elm-stuff` in the directory where the Elm file is and attempts to create these assets if they are missing.

However, this behaviour may be undesired if the Elm module you are trying to run is located in a subdirectory of your project.
In this case, you can pass option `--project-dir=/path/to/project` to run-elm and thus help it pick the correct `elm-package.json` and `elm-stuff`.
In this case, is important that `elm-package.json` mentions the subdirectory with your module in `"source-directories"` field.
Otherwise, the module will not be visible from the project directory and the command will fail.
See [Elm docs](https://guide.elm-lang.org/reuse/modules.html#building-projects-with-multiple-modules) for details.

If `--project-dir` is specified, it has to be one of the parent directories to your file.
If the given directory does not contain `elm-package.json` and `elm-stuff`, these assets are created automatically.
However, the command will likely fail because `"source-directories"` is set to `["."]` by default, which does not include subdirectories.

### Setting report format

Passing `--report=json` to run-elm makes Elm compilation errors in `stderr` easier to parse.
Please note that only the last one or two lines in `stderr` may be valid JSON strings because there exist additional messages such as `Error: Compilation failed`.

### Using custom `elm-make` instance

Passing `--path-to-elm-make=/path/to/elm-make` allows you to choose a custom `elm-make` instance (e.g. the one installed locally).
Otherwise, a globally available `elm-make` command is used to compile Elm code.

### Meta

Typing `run-elm --help` prints usage instructions, which can be handy for recalling what arguments and options the command accepts.

You can also check what version of run-elm you have installed by typing `run-elm --version`.

## Node Module API

If you are using run-elm in a Node project, you don’t have to spawn a separate process and can use `import` / `require` instead.

```js
import runElm from 'run-elm';
// or
// const runElm = require('run-elm').default;

(async () => {
  const { output, debugLog } = await runElm('path/to/Main.elm');
  // output: string
  // debugLog: string[]

  const anotherRunElmResult = await runElm(
    '/path/to/project/subdirectory/Custom.elm',
    {
      outputName: 'customOutput',
      projectDir: '/path/to/project',
      report: 'json',
      pathToElmMake: '/path/to/elm-make'
    }
  );
})();
```
