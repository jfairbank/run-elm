module Main exposing (..)


output : List String -> String
output args =
    String.join "-" args ++ "!"
