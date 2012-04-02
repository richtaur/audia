// TODO: repeating via start/end points
// global audio?
// global muting?

Audia = (function () {

	// Got Web Audio API?
	var audioContext;
	if (typeof AudioContext == "function") {
		audioContext = new AudioContext();
	} else if (typeof webkitAudioContext == "function") {
		audioContext = new webkitAudioContext();
	}

	// Core
	var audioId = 0;
	var audiaObjectsCache = {};
	var hasWebAudio = 0;//Boolean(audioContext);
	var addAudiaObject = function (object) {
		var id = ++audioId;
		audiaObjectsCache[id] = object;

		return id;
	};

	if (hasWebAudio) {
		// Web Audio API
		var Audia = function (src) {
			if (src) {
			}

			this.id = addAudiaObject(this);
		};

		// Events…

		// play()
		Audia.prototype.play = function (currentTime) {
		};
	} else {
		// Audio
		var Audia = function (src) {
			this._audioNode = new Audio();
			if (src) {
				this._audioNode.src = src;
			}

			this.id = addAudiaObject(this);
		};

		/*
		// Events…

		// None of these work in Chrome anyway, sheesh…

		// oncanplay
		Audia.prototype.__defineSetter__("oncanplay", function (onCanPlay) {
			this._audioNode.oncanplay = onCanPlay;
		});

		// oncanplaythrough
		Audia.prototype.__defineSetter__("oncanplaythrough", function (onCanPlayThrough) {
			console.log(
				this._audioNode.oncanplaythrough
			);
			this._audioNode.oncanplaythrough = onCanPlayThrough;
		});

		// onended
		Audia.prototype.__defineSetter__("onended", function (onEnded) {
			this._audioNode.onended = onEnded;
		});

		// onload
		Audia.prototype.__defineSetter__("onload", function (onLoad) {
			this._audioNode.onload = onLoad;
		});
		*/

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

			return this._audioNode.loop = loop;
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
