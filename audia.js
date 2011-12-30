// TODO: [BUG] music looping is a little bit off. I blame BUFFER and w/e the fuck is going on with that
// TODO: pan/panning (-1 -> 1)
// TODO: fade methods?
// TODO: implement proper looping
// TODO: repeating via start/end points

var Audia = (function () {
	var supported = true;

	if (typeof AudioContext == "function") {
		var audioContext = new AudioContext();
	} else if (typeof webkitAudioContext == "function") {
		var audioContext = new webkitAudioContext();
	} else {
		supported = false;
	}

	// Helper
	var clamp = function (value, min, max) {
		if (value < min) {
			return min;
		} else if (value > max) {
			return max;
		}
		return value;
	};

	var buffers = {};
	var cache = {};
	var cacheId = 0;

	var Audia = function () {
		this._id = ++cacheId;
		this._currentTime = 0;
		this._duration = 0;
		this._gain = null;
		this._onendedTimeout = null;
		this._muted = false;
		this._playing = false;
		this._source = null;
		this._startTime = null;
		this._volume = 1;

		var arg = arguments[0];
		if (typeof arg == "string") {
			this.src = arg;
		} else if (typeof arg == "object") {
			for (var key in arg) {
				this[key] = arg[key];
			}
		}

		cache[this._id] = this;
	};

	Audia.__defineGetter__("version", function () {
		return 0.1;
	});

	Audia.__defineGetter__("supported", function () {
		return supported;
	});

	if (!supported) {
		return Audia;
	}

	Audia.muteAll = function () {
		for (var id in cache) {
			cache[id].mute();
		}
	};

	Audia.unmuteAll = function () {
		for (var id in cache) {
			cache[id].unmute();
		}
	};

	Audia.prototype.__defineGetter__("currentTime", function () {
		if (this._playing) {
			var time = (audioContext.currentTime - this._startTime) + this._currentTime;
			if (time > this._duration) {
				return this._duration;
			} else {
				return time;
			}
		} else {
			return this._currentTime;
		}
	});

	Audia.prototype.__defineSetter__("currentTime", function (currentTime) {
		var currentTime = clamp(currentTime, 0, this._duration);

		if (this.currentTime != currentTime) {
			var playing = this._playing;
			this._stop();
			this._currentTime = currentTime;
			if (playing) {
				this.play();
			}
		}
	});

	Audia.prototype.__defineGetter__("duration", function () {
		return this._duration;
	});

	Audia.prototype.__defineGetter__("muted", function () {
		return this._muted;
	});

	Audia.prototype.__defineGetter__("playing", function () {
		return this._playing;
	});

	Audia.prototype.__defineGetter__("src", function () {
		return this._src;
	});

	Audia.prototype.__defineSetter__("src", function (url) {
		this._src = url;
		var sound = this;

		// Create the gain node and set the volume
		var gain = audioContext.createGainNode();
		gain.connect(audioContext.destination);
		gain.gain.value = this._volume;

		/*
		// Create the panner node and set the panning
		var panner = audioContext.createPanner();
		panner.connect(gain);
		panner.setPosition(0, 0, 0);
		panner.refDistance = 0;
		*/

		// Create the buffer source and connect to the gain
		var source = audioContext.createBufferSource();
		//source.connect(panner);
		source.connect(gain);

		// Retain!
		this._gain = gain;
		this._source = source;

		if (url in buffers) {
			source.buffer = buffers[url];

			return;
		}

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "arraybuffer";
		xhr.onload = function() {
			var buffer = audioContext.createBuffer(xhr.response, false);
			source.buffer = buffer;
			buffers[url] = buffer;
			sound._duration = buffer.duration;

			sound.onload();
		};
		xhr.send();
	});

	Audia.prototype.__defineGetter__("volume", function () {
		return this._volume;
	});

	Audia.prototype.__defineSetter__("volume", function (volume) {
		// Note: max volume of 10 is arbitrary
		var volume = clamp(volume, 0, 10);

		this._volume = volume;
		this._gain.gain.value = volume;
	});

	Audia.prototype.onended = function () {};
	Audia.prototype.onload = function () {};

	Audia.prototype.play = function (currentTime) {
		if (currentTime !== undefined) {
			this.currentTime = currentTime;
		}

		if (this._playing) {
			return;
		}

		this._regenerateBuffer();

		var BUFFER = 0.01; // TODO: gross? hopefully a better way can be found
		var grainDuration = (this._duration - this._currentTime - BUFFER);
		this._source.noteGrainOn(0, this._currentTime, grainDuration);
		this._playing = true;
		this._startTime = audioContext.currentTime;

		var sound = this;
		this._onendedTimeout = setTimeout(function () {
			sound.onended();
			sound._stop();
			sound.currentTime = 0;
			if (sound.loop) {
				sound.play();
			}
		}, grainDuration * 1000);
	};

	Audia.prototype.pause = function () {
		this._stop();
	};

	Audia.prototype.stop = function () {
		this._stop();
		this._currentTime = 0;
	};

	// "Private" methods

	Audia.prototype._stop = function () {
		if (!this._playing) {
			return;
		}

		if (this._onendedTimeout) {
			clearTimeout(this._onendedTimeout);
			this._onendedTimeout = null;
		}

		this._source.noteOff(0);
		this._expireBuffer();

		this._currentTime += (audioContext.currentTime - this._startTime);
		this._playing = false;
	};

	Audia.prototype._expireBuffer = function () {
		this._source = null;
	};

	Audia.prototype.mute = function () {
		this._muted = true;

		if (this._gain) {
			this._gain.gain.value = 0;
		}
	};

	Audia.prototype.unmute = function () {
		this._muted = false;

		if (this._gain) {
			this._gain.gain.value = this._volume;
		}
	};

	Audia.prototype._regenerateBuffer = function () {
		this.src = this._src;
	};

	return Audia;
}());
