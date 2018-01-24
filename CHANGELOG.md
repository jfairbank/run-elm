## next

### NEW - option `--output-name`

It is possible to specify which constant or function you would like to output by adding `--output-name=myCustomConstantOrFunction`.

### NEW - option `--project-dir`

Adding `--project-dir=/path/to/project` helps elm pick correct `elm-package.json` and `elm-stuff` if the file to run is in a subdirectory of a project.

### NEW - meta options

`run-elm --help` prints usage instructions and `run-elm --version` outputs the installed version

### Other Changes

* Node 6 is supported again


## v2.0.0

### NEW - Command line arguments

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
