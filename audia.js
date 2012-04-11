// Audia: <audio> implemented using the Web Audio API
// by Matt Hackett of Lost Decade Games
var Audia = (function () {

	// Got Web Audio API?
	var audioContext = null;
	if (typeof AudioContext == "function") {
		audioContext = new AudioContext();
	} else if (typeof webkitAudioContext == "function") {
		audioContext = new webkitAudioContext();
	}

	// Setup
	var Audia;
	var hasWebAudio = Boolean(audioContext);

	// Audia object creation
	var audioId = 0;
	var audiaObjectsCache = {};
	var addAudiaObject = function (object) {
		var id = ++audioId;
		audiaObjectsCache[id] = object;

		return id;
	};

	// Which approach are we taking?…

	if (hasWebAudio) {

		// Reimplement Audio using Web Audio API…

		// Setup a global gain node
		var gainNode = audioContext.createGainNode();
		gainNode.gain.value = 1;
		gainNode.connect(audioContext.destination);

		// Constructor
		Audia = function (src) {
			this.id = addAudiaObject(this);

			// Audio properties
			this._autoplay = false;
			this._buffered = []; // TimeRanges
			this._currentSrc = "";
			this._currentTime = 0;
			this._defaultPlaybackRate = 1;
			this._duration = NaN;
			this._loop = false;
			this._muted = false;
			this._paused = true;
			this._playbackRate = 1;
			this._played = []; // TimeRanges
			this._preload = "auto";
			this._seekable = []; // TimeRanges
			this._seeking = false;
			this._src = "";
			this._volume = 1;

			// Support for new Audia(src)
			if (src !== undefined) {
				this.src = src;
			}
		};

		// Methods…

		// load
		Audia.prototype.load = function (type) {
		};

		// play()
		Audia.prototype.play = function (currentTime) {
			//this.refreshBufferSource();
		};

		// pause()
		Audia.prototype.pause = function () {
		};

		// stop()
		Audia.prototype.stop = function () {
		};

		// addEventListener()
		Audia.prototype.addEventListener = function (eventName, callback, capture) {
		};

		// removeEventListener()
		Audia.prototype.removeEventListener = function (eventName, callback, capture) {
		};

		// Properties…

		// autoplay (Boolean)
		Object.defineProperty(Audia.prototype, "autoplay", {
			get: function () { return this._autoplay; },
			set: function (value) {
				this._autoplay = value;
				// TODO
			}
		});

		// buffered (TimeRanges)
		Object.defineProperty(Audia.prototype, "buffered", {
			get: function () { return this._buffered; }
		});

		// currentSrc (String)
		Object.defineProperty(Audia.prototype, "currentSrc", {
			get: function () { return this._currentSrc; }
		});

		// currentTime (Number)
		Object.defineProperty(Audia.prototype, "currentTime", {
			get: function () { return this._currentTime; },
			set: function (value) {
				this._currentTime = value;
				// TODO: implement
				// TODO: throw errors appropriately
			}
		});

		// defaultPlaybackRate (Number) (default: 1)
		Object.defineProperty(Audia.prototype, "defaultPlaybackRate", {
			get: function () { return Number(this._defaultPlaybackRate); },
			set: function (value) {
				this._defaultPlaybackRate = value;
				// TODO
			}
		});

		// duration (Number)
		Object.defineProperty(Audia.prototype, "duration", {
			get: function () { return this._audioNode.duration; }
		});

		// loop (Boolean)
		Object.defineProperty(Audia.prototype, "loop", {
			get: function () { return this._audioNode.loop; },
			set: function (value) {
				// Fixes a bug in Chrome where audio will not play if currentTime
				// is at the end of the song
				if (this._audioNode.currentTime >= this._audioNode.duration) {
					this._audioNode.currentTime = 0;
				}

				this._audioNode.loop = value;
			}
		});

		// muted (Boolean)
		Object.defineProperty(Audia.prototype, "muted", {
			get: function () { return this._audioNode.muted; },
			set: function (value) {
				this._audioNode.muted = value;
			}
		});

		// paused (Boolean)
		Object.defineProperty(Audia.prototype, "paused", {
			get: function () { return this._audioNode.paused; }
		});

		// playbackRate (Number) (default: 1)
		Object.defineProperty(Audia.prototype, "playbackRate", {
			get: function () { return this._audioNode.playbackRate; },
			set: function (playbackRate) {
				this._audioNode.playbackRate = playbackRate;
			}
		});

		// played (Boolean)
		Object.defineProperty(Audia.prototype, "played", {
			get: function () { return this._audioNode.played; }
		});

		// preload (String)
		Object.defineProperty(Audia.prototype, "preload", {
			get: function () { return this._audioNode.preload; },
			set: function (preload) {
				this._audioNode.preload = preload;
			}
		});

		// seekable (Boolean)
		Object.defineProperty(Audia.prototype, "seekable", {
			get: function () { return this._audioNode.seekable; }
		});

		// seeking (Boolean)
		Object.defineProperty(Audia.prototype, "seeking", {
			get: function () { return this._audioNode.seeking; }
		});

		// src (String)
		Object.defineProperty(Audia.prototype, "src", {
			get: function () { return this._audioNode.src; },
			set: function (value) {
				this._audioNode.src = value;
			}
		});

		// volume (Number) (range: 0-1) (default: 1)
		Object.defineProperty(Audia.prototype, "volume", {
			get: function () { return this._audioNode.volume; },
			set: function (volume) {
				this._audioNode.volume = volume;
			}
		});

////////////////////////////////////////////////////////////////////////////////////////

		/*

		var loadAudioFile = function (object, url) {
			var onLoad = function (buffer) {
				// Retain duration
				object._duration = buffer.duration;

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

		// Constructor
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

			setBufferSource(this);

			// Play the sound
			var BUFFER = 0.01; // TODO: gross? hopefully a better way can be found
			var grainDuration = (this._duration - this._currentTime - BUFFER);
			if (this.bufferSource) {
				this.bufferSource.noteOn(0);
			}
		};

		// pause()
		Audia.prototype.pause = function () {
			if (!this._playing) { return; }
			this._playing = false;

			if (this.bufferSource) {
				this.bufferSource.noteOff(0);
			}

			this._currentTime += (audioContext.currentTime - this._startTime);
		};

		// stop()
		Audia.prototype.stop = function () {
			this.pause();
			this.currentTime = 0;
		};

		// addEventListener()
		// TODO: support for … addEventListener/removeEventListener
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
			return this.bufferSource && this.bufferSource.loop;
		});
		Audia.prototype.__defineSetter__("loop", function (loop) {
			if (this.bufferSource) {
				this.bufferSource.loop = loop;
			}
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

		var setBufferSource = function (object) {
console.log('setting buffer source');
			// Create or replace buffer source
			object.bufferSource = audioContext.createBufferSource();

			// Attach buffer to buffer source
			object.bufferSource.buffer = buffersCache[object.src];
			object.bufferSource.connect(object.gainNode);
		};
		*/

	} else {

		// Create a thin wrapper around the Audio object…

		// Constructor
		Audia = function (src) {
			this.id = addAudiaObject(this);
			this._audioNode = new Audio();

			// Support for new Audia(src)
			if (src !== undefined) {
				this.src = src;
			}
		};

		// Methods…

		// load
		Audia.prototype.load = function (type) {
			this._audioNode.load();
		};

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

		// removeEventListener()
		Audia.prototype.removeEventListener = function (eventName, callback, capture) {
			this._audioNode.removeEventListener(eventName, callback, capture);
		};

		// Properties…

		// autoplay (Boolean)
		Object.defineProperty(Audia.prototype, "autoplay", {
			get: function () { return this._audioNode.autoplay; },
			set: function (value) {
				this._audioNode.autoplay = value;
			}
		});

		// buffered (TimeRanges)
		Object.defineProperty(Audia.prototype, "buffered", {
			get: function () { return this._audioNode.buffered; }
		});

		// currentSrc (String)
		Object.defineProperty(Audia.prototype, "currentSrc", {
			get: function () { return this._audioNode.src; }
		});

		// currentTime (Number)
		Object.defineProperty(Audia.prototype, "currentTime", {
			get: function () { return this._audioNode.currentTime; },
			set: function (value) {
				this._audioNode.currentTime = value;
			}
		});

		// defaultPlaybackRate (Number) (default: 1)
		Object.defineProperty(Audia.prototype, "defaultPlaybackRate", {
			get: function () { return this._audioNode.defaultPlaybackRate; },
			set: function (value) {
				this._audioNode.defaultPlaybackRate = value;
			}
		});

		// duration (Number)
		Object.defineProperty(Audia.prototype, "duration", {
			get: function () { return this._audioNode.duration; }
		});

		// loop (Boolean)
		Object.defineProperty(Audia.prototype, "loop", {
			get: function () { return this._audioNode.loop; },
			set: function (value) {
				// Fixes a bug in Chrome where audio will not play if currentTime
				// is at the end of the song
				if (this._audioNode.currentTime >= this._audioNode.duration) {
					this._audioNode.currentTime = 0;
				}

				this._audioNode.loop = value;
			}
		});

		// muted (Boolean)
		Object.defineProperty(Audia.prototype, "muted", {
			get: function () { return this._audioNode.muted; },
			set: function (value) {
				this._audioNode.muted = value;
			}
		});

		// paused (Boolean)
		Object.defineProperty(Audia.prototype, "paused", {
			get: function () { return this._audioNode.paused; }
		});

		// playbackRate (Number) (default: 1)
		Object.defineProperty(Audia.prototype, "playbackRate", {
			get: function () { return this._audioNode.playbackRate; },
			set: function (playbackRate) {
				this._audioNode.playbackRate = playbackRate;
			}
		});

		// played (Boolean)
		Object.defineProperty(Audia.prototype, "played", {
			get: function () { return this._audioNode.played; }
		});

		// preload (String)
		Object.defineProperty(Audia.prototype, "preload", {
			get: function () { return this._audioNode.preload; },
			set: function (preload) {
				this._audioNode.preload = preload;
			}
		});

		// seekable (Boolean)
		Object.defineProperty(Audia.prototype, "seekable", {
			get: function () { return this._audioNode.seekable; }
		});

		// seeking (Boolean)
		Object.defineProperty(Audia.prototype, "seeking", {
			get: function () { return this._audioNode.seeking; }
		});

		// src (String)
		Object.defineProperty(Audia.prototype, "src", {
			get: function () { return this._audioNode.src; },
			set: function (value) {
				this._audioNode.src = value;
			}
		});

		// volume (Number) (range: 0-1) (default: 1)
		Object.defineProperty(Audia.prototype, "volume", {
			get: function () { return this._audioNode.volume; },
			set: function (volume) {
				this._audioNode.volume = volume;
			}
		});
	}

	// Public helper
	Object.defineProperty(Audia, "hasWebAudio", {
		get: function () { return hasWebAudio; }
	});

	// Audio context
	Object.defineProperty(Audia, "audioContext", {
		get: function () { return audioContext; }
	});

	// Version
	Object.defineProperty(Audia, "version", {
		get: function () { return "0.3.0"; }
	});

	// canPlayType helper
	// Can be called with shortcuts, e.g. "mp3" instead of "audio/mp3"
	var audioNode;
	Audia.canPlayType = function (type) {
		if (audioNode === undefined) {
			audioNode = new Audio();
		}
		var type = (type.match("/") === null ? "audio/" : "") + type;
		return audioNode.canPlayType(type);
	};

	// canPlayType
	Audia.prototype.canPlayType = function (type) {
		return Audia.canPlayType(type);
	};

	// Lastly, wrap all "on" properties up into the events
	var eventNames = [
		"abort",
		"canplay",
		"canplaythrough",
		"durationchange",
		"emptied",
		"ended",
		"error",
		"loadeddata",
		"loadedmetadata",
		"loadstart",
		"pause",
		"play",
		"playing",
		"progress",
		"ratechange",
		"seeked",
		"seeking",
		"stalled",
		"suspend",
		"timeupdate",
		"volumechange"
	];

	for (var i = 0, j = eventNames.length; i < j; ++i) {
		(function (eventName) {
			var fauxPrivateName = "_on" + eventName;
			Audia.prototype[fauxPrivateName] = null;
			Object.defineProperty(Audia.prototype, "on" + eventName, {
				get: function () { return this[fauxPrivateName]; },
				set: function (value) {
					if (this[fauxPrivateName]) {
						this.removeEventListener(eventName, this[fauxPrivateName], false);
					}
					this[fauxPrivateName] = value;
					this.addEventListener(eventName, value, false);
				}
			});
		})(eventNames[i]);
	}

	return Audia;

})();
