# TODO

* add/remove event listenerrs
* ensure props are returning correct types (eg duration NaN)

* Reimplement Audio in WAI
* Clean up README.md:
	* Ways Audio differentiates from the Audio API
		-or- (combine?)
	* New features:
		- repeating via start/end points
		- Audia.volume (global)
		- Audia.muted (global)
		- panning (2d/3d)
		- sound sprites (?)
* Make a more compelling example

## DIFFERENCES

* Audia will clamp volume to 0, 1 when using Audio to prevent errors
* If WAI is supported, volume is as high (and grossly loud) as you want!

## Audio API

+ Property "volume"
+ Property "muted"
+ Property "duration"
+ Property "currentTime"
+ Property "seeking"
+ Property "seekable"
+ Property "played"
+ Property "playbackRate"
+ Property "paused"
+ Property "defaultPlaybackRate"
+ Property "buffered"
+ Event "volumechange"
+ Event "timeupdate"
- Event "suspend"
+ Event "stalled"
+ Event "seeking"
+ Event "seeked"
+ Event "ratechange"
+ Event "progress"
+ Event "playing"
+ Event "play"
+ Event "pause"
+ Event "loadstart"
+ Event "loadedmetadata"
+ Event "loadeddata"
+ Event "error"
+ Event "ended"
+ Event "emptied"
+ Event "durationchange"
+ Event "canplaythrough"
+ Event "canplay"
+ Event "abort"
+ Attribute "preload" with value "metadata"
+ Attribute "loop"
+ Attribute "autoplay"
+ Hot swapping audio src
+ Follows 30x responses on src (cross domain ssl redirection)
+ Consistent time between play() and actual playback (&lt; 20ms)
+ Multiple Audio objects playing at the same time
+ Supports WAV format
+ Supports Ogg format
+ Supports MP3 format
+ Supports AAC format
- Seeking to unbuffered position with continuous playback after seeking
