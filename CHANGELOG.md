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
