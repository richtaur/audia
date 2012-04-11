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

	// Math helper
	var clamp = function (value, min, max) {
		return Math.min(Math.max(Number(value), min), max);
	};

	// Which approach are we taking?…

	if (hasWebAudio) {

		// Reimplement Audio using Web Audio API…

		// Setup a master gain node
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

			// Create gain node
			this.gainNode = audioContext.createGainNode();
			this.gainNode.gain.value = this._volume;

			// Connect to master gain node
			this.gainNode.connect(gainNode);

			// Support for new Audia(src)
			if (src !== undefined) {
				this.src = src;
			}
		};

		// Methods…

		// load
		Audia.prototype.load = function (type) {
			// TODO
		};

		// play()
		Audia.prototype.play = function (currentTime) {
			// TODO
		};

		// pause()
		Audia.prototype.pause = function () {
			// TODO
		};

		// stop()
		Audia.prototype.stop = function () {
			// TODO
		};

		// addEventListener()
		Audia.prototype.addEventListener = function (eventName, callback, capture) {
			// TODO
		};

		// removeEventListener()
		Audia.prototype.removeEventListener = function (eventName, callback, capture) {
			// TODO
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
				// TODO
				// TODO: throw errors appropriately (eg DOM error)
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
			get: function () { return this._duration; }
		});

		// loop (Boolean)
		Object.defineProperty(Audia.prototype, "loop", {
			get: function () { return this._loop; },
			set: function (value) {
				this._loop = value;
				// TODO
			}
		});

		// muted (Boolean)
		Object.defineProperty(Audia.prototype, "muted", {
			get: function () { return this._muted; },
			set: function (value) {
				this._muted = value;
				// TODO
			}
		});

		// paused (Boolean)
		Object.defineProperty(Audia.prototype, "paused", {
			get: function () { return this._paused; }
		});

		// playbackRate (Number) (default: 1)
		Object.defineProperty(Audia.prototype, "playbackRate", {
			get: function () { return this._playbackRate; },
			set: function (value) {
				this._playbackRate = value;
				// TODO
			}
		});

		// played (Boolean)
		Object.defineProperty(Audia.prototype, "played", {
			get: function () { return this._played; }
		});

		// preload (String)
		Object.defineProperty(Audia.prototype, "preload", {
			get: function () { return this._preload; },
			set: function (value) {
				this._preload = value;
				// TODO
			}
		});

		// seekable (Boolean)
		Object.defineProperty(Audia.prototype, "seekable", {
			get: function () { return this._seekable; }
		});

		// seeking (Boolean)
		Object.defineProperty(Audia.prototype, "seeking", {
			get: function () { return this._seeking; }
		});

		// src (String)
		Object.defineProperty(Audia.prototype, "src", {
			get: function () { return this._src; },
			set: function (value) {
				this._src = value;
				// TODO
			}
		});

		// volume (Number) (range: 0-1) (default: 1)
		Object.defineProperty(Audia.prototype, "volume", {
			get: function () { return this._volume; },
			set: function (value) {
				// Emulate Audio by throwing an error if volume is out of bounds
				if (!Audia.preventErrors) {
					if (clamp(value, 0, 1) !== value) {
						// TODO: throw DOM error
					}
				}

				if (value < 0) { value = 0; }
				this._volume = value;
				// TODO
			}
		});

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
			set: function (value) {
				this._audioNode.playbackRate = value;
			}
		});

		// played (Boolean)
		Object.defineProperty(Audia.prototype, "played", {
			get: function () { return this._audioNode.played; }
		});

		// preload (String)
		Object.defineProperty(Audia.prototype, "preload", {
			get: function () { return this._audioNode.preload; },
			set: function (value) {
				this._audioNode.preload = value;
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
			set: function (value) {
				if (Audia.preventErrors) {
					var value = clamp(value, 0, 1);
				}
				this._audioNode.volume = value;
			}
		});
	}

	// Prevent errors?
	Audia.preventErrors = true;

	// Public helper
	Object.defineProperty(Audia, "hasWebAudio", {
		get: function () { return hasWebAudio; }
	});

	// Audio context
	Object.defineProperty(Audia, "audioContext", {
		get: function () { return audioContext; }
	});

	// Gain node
	Object.defineProperty(Audia, "gainNode", {
		get: function () { return gainNode; }
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
					// Remove the old listener
					if (this[fauxPrivateName]) {
						this.removeEventListener(eventName, this[fauxPrivateName], false);
					}

					// Only set functions
					if (typeof value == "function") {
						this[fauxPrivateName] = value;
						this.addEventListener(eventName, value, false);
					} else {
						this[fauxPrivateName] = null;
					}
				}
			});
		})(eventNames[i]);
	}

	return Audia;

})();
