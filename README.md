# run-elm

[![npm](https://img.shields.io/npm/v/run-elm.svg?style=flat-square)](https://www.npmjs.com/package/run-elm)

##### Run Elm code from the command line

Ever want to quickly try out some Elm code that's too complex for the REPL or
too much of a hassle to bootstrap with the Elm architecture and the browser?
run-elm has you covered. run-elm allows you to quickly define a module that you
can run from the command line!

## Prerequisites

run-elm requires Node versions >= 8.

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
filename. Then, add an `output` variable of type `String` for whatever you want
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

## Command Line Arguments

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
