

var e = null;

function setup() {
	e = new evolution();
	init(768,512);
	backgroundStyle(55,55,55);

	console.log("INIT");

}

function draw() {

	clear();
	e.run();

	drawUi();
}

function drawUi() {

	textAlign(ALIGN_CENTER);
	textSize(32);
	fill(255,255,255);

	text(640,30,"SNAKE");

}

function onKeyDown() {

	// g.catchInput();
}

