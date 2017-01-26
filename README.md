# run-elm

##### Run Elm code from the command line

Ever want to quickly try out some Elm code that's too complex for the REPL or
too much of a hassle to bootstrap with the Elm architecture and the browser?
run-elm has you covered. run-elm allows you to quickly define a module that you
can run from the command line!

## Prerequisites

run-elm expects a current version of the Elm binary installed globally. You can
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

```sh
$ run-elm Hello.elm
Hello World!
```

You should see your message printed to the console.

## Limitations

run-elm doesn't allow you to pass in any arguments, but that could be a useful
future feature. Therefore, run-elm is mainly useful for just prototyping or
testing out types and functions that are too cumbersome to type in the REPL.
