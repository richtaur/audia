// TODO: WAI implementation
// TODO: double check docs
// TODO: repeating via start/end points
// TODO: global volume?
// TODO: global muting?
// TODO: speed! tempo, sampling, w/e

Audia = (function () {

	// Got Web Audio API?
	var audioContext;
	if (typeof AudioContext == "function") {
		audioContext = new AudioContext();
	} else if (typeof webkitAudioContext == "function") {
		audioContext = new webkitAudioContext();
	}

	// Core
	var Audia;
	var buffersCache = {};
	var audioId = 0;
	var audiaObjectsCache = {};
	var hasWebAudio = Boolean(audioContext);

	if (hasWebAudio) {
		// Web Audio API

		var loadAudioFile = function (object, url) {
			var onLoad = function (buffer) {
				// Retain duration
				object._duration = buffer.duration;

				// Create or replace buffer source
				object.bufferSource = audioContext.createBufferSource();

				// Attach buffer to source
				object.bufferSource.buffer = buffer;

				// Connect buffer source to gain
				object.bufferSource.connect(object.gainNode);

				// TODO: need to figure out events with WAI
				//sound.onload();
			};

			if (url in buffersCache) {
				onLoad(buffersCache[url]);
			} else {
				var xhr = new XMLHttpRequest();
				xhr.open("GET", url, true);
				xhr.responseType = "arraybuffer";
				xhr.onload = function () {
					audioContext.decodeAudioData(xhr.response, function (buffer) {
						buffersCache[url] = buffer;
						onLoad(buffer);
					});
				};
				xhr.send();
			}
		};

		Audia = function (src) {
			this.id = addAudiaObject(this);

			// Setup
			this._currentTime = 0;
			this._duration = NaN;
			this._playing = false;
			this._startTime = 0;
			this._volume = 1;

			// Gain
			this.gainNode = audioContext.createGainNode();
			this.gainNode.gain.value = this._volume;

			// Output
			// TODO: global Audia gainNode
			this.gainNode.connect(audioContext.destination);

			if (typeof src == "object") {
				for (var key in src) {
					this[key] = src[key];
				}
			} else if (typeof src == "string") {
				this.src = src;
			}
		};

		// Methods…

		// play()
		Audia.prototype.play = function (currentTime) {
			if (currentTime !== undefined) {
				this.currentTime = currentTime;
			}

			// Nothing left to do it it's already playing…
			if (this._playing) { return; }

			this._playing = true;
			this._startTime = audioContext.currentTime;

			// Play the sound
			var BUFFER = 0.01; // TODO: gross? hopefully a better way can be found
			var grainDuration = (this._duration - this._currentTime - BUFFER);
			if (this.bufferSource) {
				this.bufferSource.noteOn(0);
			}
		};

		// pause()
		Audia.prototype.pause = function () {
			this.bufferSource.noteOff(0);
			refreshBufferSource(this);
		};

		// stop()
		Audia.prototype.stop = function () {
			this.pause();
			this.currentTime = 0;
		};

		// addEventListener()
		// TODO: support for … things
		Audia.prototype.addEventListener = function (eventName, callback, capture) {
		};

		// Properties…

		// currentSrc (String) (read-only)
		Audia.prototype.__defineGetter__("currentSrc", function () {
		});

		// currentTime (Number)
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
			//var currentTime = clamp(currentTime, 0, this._duration);

			if (this.currentTime != currentTime) {
				var playing = this._playing;
				this._stop();
				this._currentTime = currentTime;
				if (playing) {
					this.play();
				}
			}
		});

		// duration (Number) (read-only)
		Audia.prototype.__defineGetter__("duration", function () {
			return Number(this._duration);
		});

		// loop (Boolean)
		Audia.prototype.__defineGetter__("loop", function () {
		});
		Audia.prototype.__defineSetter__("loop", function (loop) {
		});

		// muted (Boolean)
		Audia.prototype.__defineGetter__("muted", function () {
			return this._muted;
		});
		Audia.prototype.__defineSetter__("muted", function (muted) {
			this._muted = muted;
		});

		// paused (Boolean)
		Audia.prototype.__defineGetter__("paused", function () {
			return !this._playing;
		});

		// src (String)
		Audia.prototype.__defineGetter__("src", function () {
			return this._src;
		});
		Audia.prototype.__defineSetter__("src", function (src) {
			this._src = src;
			loadAudioFile(this, src);
		});

		// volume (Number) (range: 0-1) (default: 1)
		Audia.prototype.__defineGetter__("volume", function () {
		});
		Audia.prototype.__defineSetter__("volume", function (volume) {
			this.gainNode.gain.value = volume;
		});

		// Audia stuff…

		var addAudiaObject = function (object) {
			var id = ++audioId;
			audiaObjectsCache[id] = object;

			return id;
		};

		var refreshBufferSource = function (object) {
console.log('refresh buffer source');
			// Create or replace buffer source
			object.bufferSource = audioContext.createBufferSource();

			// Attach buffer to buffer source
			object.bufferSource.buffer = buffersCache[object.src];
		};

	} else {

		// Audio element
		Audia = function (src) {
			this.id = addAudiaObject(this);
			this._audioNode = new Audio();

			if (typeof src == "object") {
				for (var key in src) {
					this[key] = src[key];
				}
			} else if (typeof src == "string") {
				this._audioNode.src = src;
			}
		};

		// Methods…

		// play()
		Audia.prototype.play = function (currentTime) {
			if (currentTime !== undefined) {
				this._audioNode.currentTime = currentTime;
			}
			this._audioNode.play();
		};

		// pause()
		Audia.prototype.pause = function () {
			this._audioNode.pause();
		};

		// stop()
		Audia.prototype.stop = function () {
			this._audioNode.pause();
			this._audioNode.currentTime = 0;
		};

		// addEventListener()
		Audia.prototype.addEventListener = function (eventName, callback, capture) {
			this._audioNode.addEventListener(eventName, callback, capture);
		};

		// Properties…

		// currentSrc (String) (read-only)
		Audia.prototype.__defineGetter__("currentSrc", function () {
			return this._audioNode.src;
		});

		// currentTime (Number)
		Audia.prototype.__defineGetter__("currentTime", function () {
			return this._audioNode.currentTime;
		});
		Audia.prototype.__defineSetter__("currentTime", function (currentTime) {
			return this._audioNode.currentTime = currentTime;
		});

		// duration (Number) (read-only)
		Audia.prototype.__defineGetter__("duration", function () {
			return this._audioNode.duration;
		});

		// loop (Boolean)
		Audia.prototype.__defineGetter__("loop", function () {
			return this._audioNode.loop;
		});
		Audia.prototype.__defineSetter__("loop", function (loop) {
			// Fixes a bug in Chrome where audio will not play if currentTime
			// is at the end of the song
			if (this._audioNode.currentTime >= this._audioNode.duration) {
				this._audioNode.currentTime = 0;
			}

			this._audioNode.loop = loop;
		});

		// muted (Boolean)
		Audia.prototype.__defineGetter__("muted", function () {
			return this._audioNode.muted;
		});
		Audia.prototype.__defineSetter__("muted", function (muted) {
			return this._audioNode.muted = muted;
		});

		// paused (Boolean)
		Audia.prototype.__defineGetter__("paused", function () {
			return this._audioNode.paused;
		});

		// src (String)
		Audia.prototype.__defineGetter__("src", function () {
			return this._audioNode.src;
		});
		Audia.prototype.__defineSetter__("src", function (src) {
			return this._audioNode.src = src;
		});

		// volume (Number) (range: 0-1) (default: 1)
		Audia.prototype.__defineGetter__("volume", function () {
			return this._audioNode.volume;
		});
		Audia.prototype.__defineSetter__("volume", function (volume) {
			return this._audioNode.volume = volume;
		});
	}

	// Core
	Audia.version = "0.2.0";
	Audia.audioContext = audioContext;

	// canPlayType helper
	var audioNode;
	Audia.canPlayType = function (type) {
		if (audioNode === undefined) {
			audioNode = new Audio();
		}
		var type = (type.match("/") === null ? "audio/" : "") + type;
		return audioNode.canPlayType(type);
	};

	return Audia;

})();
