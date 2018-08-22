

var e = null;
var bestScore = 0;
var interval = 50;

function setup() {
	e = new evolution();
	init(768,512);
	backgroundStyle(55,55,55);

	console.log("INIT");


	{//setup slider

		var input = document.getElementById('speedinp');
		var slider = document.getElementById("speedrange");
		slider.value = 50;
		slider.oninput = function() {
			interval = slider.value;
			input.value = slider.value;
		};
		input.oninput = function() {

			// var val = 0;
			interval = input.value;
			slider.value = interval;
		}

	}

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
	
	textSize(20);
	fill(180,180,255);
	text(640, 250, "HighScore: "+bestScore);
}

function onKeyDown() {

	// g.catchInput();
}

