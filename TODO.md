# TODO

* Go through all TODOs in audia.js
* Go through events, make sure they're getting fired
* Go through properties (eg, played) make sure they're getting updated
* Ensure props are returning correct types (eg duration NaN)
* Clean up README.md, delete this file
* Make a more compelling example

## Audio API

+ Property "volume"
+ Property "muted"
- Property "duration"
- Property "currentTime"
- Property "seeking"
- Property "seekable"
- Property "played"
- Property "playbackRate"
- Property "paused"
- Property "defaultPlaybackRate"
- Property "buffered"

+ Event "volumechange"
- Event "timeupdate"
- Event "suspend"
- Event "stalled"
- Event "seeking"
- Event "seeked"
- Event "ratechange"
- Event "progress"
- Event "playing"
- Event "play"
- Event "pause"
- Event "loadstart"
- Event "loadedmetadata"
- Event "loadeddata"
- Event "error"
- Event "ended"
- Event "emptied"
- Event "durationchange"
- Event "canplaythrough"
- Event "canplay"
- Event "abort"

- Attribute "preload" with value "metadata"
- Attribute "loop"
- Attribute "autoplay"
- Hot swapping audio src
- Follows 30x responses on src (cross domain ssl redirection)
- Consistent time between play() and actual playback (&lt; 20ms)
- Multiple Audio objects playing at the same time
- Supports WAV format
- Supports Ogg format
- Supports MP3 format
- Supports AAC format
- Seeking to unbuffered position with continuous playback after seeking

## Differences

* When falling back to `<audio>`, fixes a bug in Chrome where audio will not play if `currentTime` is at the end of the buffer
* `Audia.version` displays the version of Audia being used (e.g., "0.3.0")
* `Audia.preventErrors` prevents errors from being thrown as `Audio` would (e.g., `audio.volume` not within `0` to `1`) (default: `true`)
* When WAA is supported, volume can be raised above `1`
* `Audia.audioContext` provides access to Audia's Web Audio API audio context
* `Audia.gainNode` provides access to Audia's master gain node
* `Audia.hasWebAudio` is a `Boolean` helper that lets you know if the client supports Web Audio API
* Defaults for `audia.on*` are all `null`; `audio.*` seems to be sometimes `null`, sometimes `undefined`
* `Audia.canPlayType` is a helper that allows for shortcuts (e.g., `if (Audia.canPlayType("mp3") { … }`)
* `audia.canPlayType` also supports shortcuts
* `audia._*` are "faux-private" variables (that should mostly just be ignored)
* `audia.stop()` New method that calls `pause` and sets `currentTime` to `0`

## Feature ideas

* repeating via start/end points
* Audia.volume (global)
* Audia.muted (global)
* panning (2d/3d)
* sound sprites (?)
* audia.play(currentTime)
