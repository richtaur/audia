// Shop music
var shopMusic = new Sound();
shopMusic.src = "audio/shop.mp3";

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

// Attack sound
var attackSound = new Sound();
attackSound.src = "audio/demoblin_attacks.mp3";

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
