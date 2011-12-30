# Audia

An HTML5 library for simplifying sound playback via the [Web Audio API][1].

A complete write-up on this project can be found on the [Lost Decade Games blog][2].

## API Documentation

### Global audia object

Example: `var canPlay = Audia.supported;`

* **supported**: `Boolean` True if the library is supported by the browser, otherwise false. (Read only)
* **version**: `Number` The version of Audia being run. (Current: `0.1`)

### Audia instances

Example: `var sound = new Audia();`

#### Properties

* **currentTime**: `Number` The playback point of the sound in seconds.
* **duration**: `Number` The length of the current sound buffer in seconds. (Read only)
* **loop**: `Boolean` If set to true, the audio will play again when it reaches the end of playback. (default: `false`)
* **muted**: `Boolean` True if the sound has been muted, otherwise false.
* **playing**: `Boolean` True if the sound is playing, otherwise false. (Read only)
* **src**: `String` The URL of a sound file to load.
* **volume**: `Number` The volume of the playback where `0` is muted and `1` is normal volume. (arbitrary maximum = `10`), (default: `1`)
* **onended**: `Function` Gets called when playback reaches the end of the buffer.
* **onload**: `Function` Gets called when a sound file (requested by setting `src`) is done loading.

#### Methods

* **play**: Begins playback of the sound buffer. Arguments: `currentTime` (optional) Sets the `currentTime` property before playing.
* **pause**: Pauses sound playback (retaining `currentTime`).
* **stop**: Stops sound playback (resetting `currentTime` to `0`).
* **mute**: Silences playback of the sound buffer.
* **unmute**: Restores audible playback of the sound buffer.

## Examples

### Create a sound object and play an mp3

```javascript
var sound = new Audia();
sound.src = "onslaught.mp3";
sound.play();
```
### Create sounds with some sugar

```javascript
var backgroundMusic = new Audia("joshua_morse.mp3");
var battleMusic = new Audia({
	src: "a_recurring_conflict.mp3",
	loop: true
});
```

### Move the playback pointer to 30 seconds into the sound buffer

```javascript
sound.currentTime = 30;
```

### Calculate the percentage of song that's played

```javascript
var percentage = (sound.currentTime / sound.duration) * 100;
```

### Stop it if it's playing

```javascript
if (sound.playing) {
	sound.stop();
}
```

### Play it when it loads

```javascript
sound.onload = function () {
	doSomething();
};
sound.src = "new_song.mp3";
```

[1]: https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
[2]: http://www.lostdecadegames.com/audia-is-a-library-for-simplifying-the-web-audio-api/
