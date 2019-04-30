
var renderer = null;

window.onload = () => {
	init();

};

var c = null;

var mouseleftStart = null;
var mouseleft = false;


var mouserightStart = null;
var mouseright = false;

function init () {
	renderer = new Renderer3D();
	renderer.init();

	document.body.appendChild(renderer.dom);
	var x = renderer.dom.getContext('2d');

	mouseleftStart = p2(0,0);
	mouserightStart = p2(0,0);


	var cube = createCube(3,3,3);

	cube.position = p3 ( 10,5, 20);

	c = cube;

	renderer.objects.push(cube);

	renderer.dom.addEventListener('contextmenu', function (e) {
		e.preventDefault();
	});
	renderer.dom.addEventListener('mousedown', function (e) {

		console.log(e);

		e.preventDefault();

		if ( e.button == 0 ) {
			//LEFT
			mouseleftStart.x = e.offsetX;
			mouseleftStart.y = e.offsetY;
			mouseleft = true;
		}
		else if ( e.button == 2 ) {
			//RIGHT
			mouserightStart.x = e.offsetX;
			mouserightStart.y = e.offsetY;
			mouseright = true;
		}
	});
	renderer.dom.addEventListener('mouseup', function (e) {
		e.preventDefault();

		if ( e.button == 0 ) {
			//LEFT
			mouseleftStart.x = 0;
			mouseleftStart.y = 0;
			mouseleft = false;
		}
		else if ( e.button == 2 ) {
			//RIGHT
			mouserightStart.x = 0;
			mouserightStart.y = 0;
			mouseright = false;
		}
	});
	renderer.dom.addEventListener('mousemove', function (e) {


		if ( e.button == 0 && mouseleft ) {
			var cposx = e.offsetX - mouseleftStart.x;
			var cposy = e.offsetY - mouseleftStart.y;
			c.rotation.x += cposx/100;
			c.rotation.y += cposy/100;

			mouseleftStart.x = e.offsetX;
			mouseleftStart.y = e.offsetY;
		}
		else if ( e.button == 2 && mouseright ) {
			var cposx = e.offsetX - mouserightStart.x;
			var cposy = e.offsetY - mouserightStart.y;
			renderer.camera.x += cposx/20;
			renderer.camera.y += cposy/20;

			mouserightStart.x = e.offsetX;
			mouserightStart.y = e.offsetY;

		}

	});

	renderer.dom.addEventListener('touchstart', function (e) {
		e.preventDefault();
		e = e.touches[0];


		mouseleftStart.x = e.clientX;
		mouseleftStart.y = e.clientY;
		mouseleft = true;
	});

	renderer.dom.addEventListener('touchmove', function (e) {

		e.preventDefault();
		e = e.touches[0];
		if ( mouseleft ) {
			var cposx = e.clientX - mouseleftStart.x;
			var cposy = e.clientY - mouseleftStart.y;
			c.rotation.x += cposx/100;
			c.rotation.y += cposy/100;

			mouseleftStart.x = e.clientX;
			mouseleftStart.y = e.clientY;
		}

	});

	
	renderer.dom.addEventListener('touchend', function (e) {
		e.preventDefault();

			//LEFT
		mouseleftStart.x = 0;
		mouseleftStart.y = 0;
		mouseleft = false;
	});

	frame();
}

var dt = 0;
var lt = 0;

function frame () {

	requestAnimationFrame(frame);

	update();
	draw();

	dt = performance.now()-lt;
	lt = performance.now();
}

function draw () {

	renderer.render();
}


var angle = 0;

function d2r (d){
	return d * Math.PI/180;
};

function update () {

	// c.rotation.z = angle;
	// c.rotation.y = angle;

	angle += d2r(90)*(dt/1000);
}
