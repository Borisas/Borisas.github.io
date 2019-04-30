

var e = null;
var bestScore = 0;
var interval = 50;

function setup() {
	e = new evolution();
	init(768,512,true);
	backgroundStyle(55,55,55);


	{//setup slider

		var input = document.getElementById('speedinp');
		var slider = document.getElementById("speedrange");

		// 1 = 20
		// 0.01 = 1000

		var v = Math.floor(100 * 950/980);

		slider.value = v;
		input.value = v;
		slider.oninput = function() {

			var uv = slider.value / 100;

			var value = 20 + (1-uv) * (1000-20);

			interval = value;
			input.value = slider.value;
		};
		input.oninput = function() {

			var uv = input.value / 100;

			var value = 20 + (1-uv) * (1000-20);

			interval = value;
			slider.value = input.value;
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

