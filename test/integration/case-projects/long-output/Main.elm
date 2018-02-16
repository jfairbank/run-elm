module Main exposing (..)

import Array exposing (toList, repeat)
import String exposing (join)


output : String
output =
    join "\n" <| toList <| repeat 100000 "static output"
