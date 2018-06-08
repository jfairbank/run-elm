## 2.3.0

### NEW - Option `--path-to-elm-make`

Passing `--path-to-elm-make=/path/to/elm-make` allows you to choose a custom `elm-make` instance (e.g. the one installed locally) ([#13](https://github.com/jfairbank/run-elm/pull/13))

### NEW - Node API interface

It is now possible to execute run-elm via `import` / `require` in addition to spawning a process ([#14](https://github.com/jfairbank/run-elm/pull/14))

### Other changes

* Add full stops to some error messages for consistency ([#15](https://github.com/jfairbank/run-elm/pull/15))

---

## 2.2.0

### NEW - Option `--report`

Passing `--report=json` to run-elm makes Elm compilation errors in `stderr` easier to parse ([#12](https://github.com/jfairbank/run-elm/pull/12))

---

## 2.1.1

### Bug Fixes

* Fix stdout truncation ([#8](https://github.com/jfairbank/run-elm/pull/8))

---

## 2.1.0

This release includes new command line options courtesy of [@kachkaev](https://github.com/kachkaev).

### NEW - Option `--output-name`

Specify a custom name for the output constant or function by adding `--output-name=myCustomConstantOrFunction`.

### NEW - Option `--project-dir`

Add `--project-dir=/path/to/project` to help Elm pick the correct `elm-package.json` and `elm-stuff` if the Elm file is in a subdirectory.

### NEW - Meta Options

`run-elm --help` prints usage instructions and `run-elm --version` outputs the installed version.

### Other Changes

* Bring back Node 6 support.

---

## v2.0.0

### NEW - Command Line Arguments

run-elm now supports command line arguments to `output` as a list of strings.

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

run-elm still supports an `output` function with no args.

```elm
output : String
output =
    "Some static content"
```

### Breaking Changes

* run-elm now only supports Node 8 and after

---

## v1.0.1

Internal changes

---

## v1.0.0

Initial release
