
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
		e.preventDefault();

		if ( e.button == 0 ) {
			//LEFT
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
		}
		else if ( e.button == 2 ) {
			//RIGHT
			mouserightStart.x = 0;
			mouserightStart.y = 0;
			mouseright = true;
		}
	});
	renderer.dom.addEventListener('mousemove', function (e) {

		if ( e.button == 2 && mouseright ) {
			var cposx = e.offsetX - mouserightStart.x;
			var cposy = e.offsetY - mouserightStart.y;
			renderer.camera.x += cposx/20;
			renderer.camera.y += cposy/20;

			mouserightStart.x = e.offsetX;
			mouserightStart.y = e.offsetY;

		}

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
	c.rotation.y = angle;

	angle += d2r(90)*(dt/1000);
}
