/*
{
	"Properties": {
		"currentTime": {"type": Number, "description": ""},
		"duration": {"type": Number, "readOnly": true, "description": "Returns the length of the current sound buffer (in seconds)."},
		//"loop": {"type": Boolean, "description": ""},
		//"pan": {"type": Number, "default": 0},
		"playing": {"type": Boolean, "readOnly": true, "description": "True if the sound is playing, otherwise false."},
		"src": {"type": String},
		"onload": {"type": Function, "description": "Called on sound file loaded (after setting src)."}
	},
	"Methods": {
		"play": "Starts playback of the sound.",
		"pause": "Stops playback of the sound.",
		"stop": "Stops playback of the sound and sets currentTime to 0."
	}
};
*/

// onended?
// polyphony?
// TODO: sounds are still "playing" even after they've ended ... setInterval? have a _refreshStatus method? hrm ...

var Sound = (function () {
	if (typeof AudioContext == "function") {
		var audioContext = new AudioContext();
	} else if (typeof webkitAudioContext == "function") {
		var audioContext = new webkitAudioContext();
	} else {
		throw "No AudioContext object found.";
	}

	var buffers = {};

	var Sound = function () {
		this._currentTime = 0;
		this._duration = 0;
		this._playing = false;
		this._source = null;
		this._startTime = null;
	};

	Sound.prototype.__defineGetter__("currentTime", function () {
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

	Sound.prototype.__defineSetter__("currentTime", function (currentTime) {
		if (currentTime < 0) {
			currentTime = 0;
		}
		if (currentTime > this._duration) {
			currentTime = this._duration;
		}

		if (this.currentTime != currentTime) {
			var playing = this._playing;
			this._stop();
			this._currentTime = currentTime;
			if (playing) {
				this.play();
			}
		}
	});

	Sound.prototype.__defineGetter__("duration", function () {
		return this._duration;
	});

	/*
	// TODO
	Sound.prototype.__defineSetter__("loop", function (loop) {
		this._source.loop = loop;
	});
	*/

	Sound.prototype.__defineGetter__("playing", function () {
		return this._playing;
	});

	Sound.prototype.__defineGetter__("src", function () {
		return this._src;
	});

	Sound.prototype.__defineSetter__("src", function (url) {
		this._src = url;
		var sound = this;
		var onload = this.onload;

		var source = audioContext.createBufferSource();
		source.connect(audioContext.destination);
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

			onload && onload();
		};
		xhr.send();
	});

	Sound.prototype.play = function () {
		if (this._playing) {
			return;
		}

		this._regenerateBuffer();

		var grainDuration = (this._duration - this._currentTime - 0.1);
		this._source.noteGrainOn(0, this._currentTime, grainDuration);
		this._playing = true;
		this._startTime = audioContext.currentTime;
	};

	Sound.prototype.pause = function () {
		this._stop();
	};

	Sound.prototype._stop = function () {
		if (!this._playing) {
			return;
		}

		this._source.noteOff();
		this._expireBuffer();

		this._currentTime += (audioContext.currentTime - this._startTime);
		this._playing = false;
	};

	Sound.prototype.stop = function () {
		this._stop();
		this._currentTime = 0;
	};

	Sound.prototype._expireBuffer = function () {
		this._source = null;
	};
	Sound.prototype._regenerateBuffer = function () {
		this.src = this._src;
	};

	return Sound;
}());
