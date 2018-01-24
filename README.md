# run-elm

[![npm](https://img.shields.io/npm/v/run-elm.svg?style=flat-square)](https://www.npmjs.com/package/run-elm)

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

### Customising output name

It is possible to specify which constant or function you would like to output by adding `--output-name=myCustomConstantOrFunction` to the command:

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

### Running modules in Elm project subdirectories

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

### Meta

Typing `run-elm --help` prints usage instructions, which can be handy for recalling what arguments and options the command accepts.

You can also check what version of elm-run you have installed by typing `run-elm --version`.
