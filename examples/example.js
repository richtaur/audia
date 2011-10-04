(function () {

// Supported? If not, get Chrome, son!
if (!Audia.supported) {
	document.body.innerHTML = "Sorry, your browser doesn't support AudioContext.";
	return;
}

// Attack sound
var attackSound = new Audia("audio/demoblin_attacks.mp3");

// Play
var playAttack = document.getElementById("play-attack");
playAttack.addEventListener("click", function () {
	attackSound.play();
}, false);

// Loop
var loopAttack = document.getElementById("loop-attack");
loopAttack.addEventListener("click", function () {
	attackSound.loop = loopAttack.checked;
}, false);

// Shop music
var shopMusic = new Audia({
	src: "audio/shop.mp3",
	loop: true
});

// Play
var playShop = document.getElementById("play-shop");
playShop.addEventListener("click", function () {
	shopMusic.play();
}, false);

// Pause
var pauseShop = document.getElementById("pause-shop");
pauseShop.addEventListener("click", function () {
	shopMusic.pause();
}, false);

// Stop
var stopShop = document.getElementById("stop-shop");
stopShop.addEventListener("click", function () {
	shopMusic.stop();
}, false);

// Current time
var currentTimeShop = document.getElementById("current-time-shop");
var currentTimeInterval = setInterval(function () {
	currentTimeShop.innerHTML = Math.round(shopMusic.currentTime) + "/" + Math.floor(shopMusic.duration);
}, 50);
document.getElementById("set-current-time-shop").addEventListener("click", function () {
	shopMusic.currentTime = Number(document.getElementById("current-time-value-shop").value);
});

// Volume
var volumeShop = document.getElementById("volume-shop");
document.getElementById("set-volume-shop").addEventListener("click", function () {
	shopMusic.volume = Number(document.getElementById("volume-shop").value);
});

}());
