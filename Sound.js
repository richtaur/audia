// TODO: [BUG] music looping is a little bit off. I blame BUFFER and w/e the fuck is going on with that
// TODO: volume (0 -> 1)
// TODO: pan/panning (-1 -> 1)
// TODO: polyphony?
// TODO: fade?

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
		this._onendedTimeout = null;
		this._playing = false;
		this._source = null;
		this._startTime = null;

		var arg = arguments[0];
		if (typeof arg == "string") {
			this.src = arg;
		} else if (typeof arg == "object") {
			for (var key in arg) {
				this[key] = arg[key];
			}
		}
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

	Sound.prototype.__defineGetter__("playing", function () {
		return this._playing;
	});

	Sound.prototype.__defineGetter__("src", function () {
		return this._src;
	});

	Sound.prototype.__defineSetter__("src", function (url) {
		this._src = url;
		var sound = this;

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

			sound.onload();
		};
		xhr.send();
	});

	Sound.prototype.onended = function () {};
	Sound.prototype.onload = function () {};

	Sound.prototype.play = function () {
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

	Sound.prototype.pause = function () {
		this._stop();
	};

	Sound.prototype._stop = function () {
		if (!this._playing) {
			return;
		}

		if (this._onendedTimeout) {
			clearTimeout(this._onendedTimeout);
			this._onendedTimeout = null;
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
