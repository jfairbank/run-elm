module DebugLogMultiple exposing (..)

import Debug exposing (log)

factorial : Int -> Int
factorial n =
    if n < 1 then
        1
    else
        -- factorial (n - 1) * n
        (log "value" (factorial (n - 1))) * (log "for n" n)

output : String
output =
    toString <| factorial 10