module CustomOutputWithFunction exposing (..)


output : String
output =
    "static output from "


customFunction : List String -> String
customFunction args =
    output ++ String.join " " args
