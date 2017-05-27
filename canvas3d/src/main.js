
var renderer = null;

window.onload = () => {
	init();

};

var c = null;

function init () {
	renderer = new Renderer3D();
	renderer.init();

	document.body.appendChild(renderer.dom);
	var x = renderer.dom.getContext('2d');


	var cube = new Obj3D();
	var v = [];

	v.push(p3(-1,1,-1));	//A		0
	v.push(p3(-1,-1,-1));	//B		1
	v.push(p3(1,-1,-1));	//C		2
	v.push(p3(1,1,-1));		//D		3
	v.push(p3(-1,1,1));		//A1	4
	v.push(p3(-1,-1,1));	//B1	5
	v.push(p3(1,-1,1));		//C1	6
	v.push(p3(1,1,1));		//D1	7
	cube.vertexes = v;

	var l = [];
	l.push(line(0,1));
	l.push(line(0,3));
	l.push(line(0,4));
	l.push(line(1,2));
	l.push(line(1,5));
	l.push(line(2,3));
	l.push(line(2,6));
	l.push(line(3,7));
	l.push(line(4,7));
	l.push(line(4,5));
	l.push(line(5,6));
	l.push(line(6,7));
	cube.lines = l;

	cube.position = p3 ( -3, 0, 20);

	c = cube;

	renderer.objects.push(cube);

	// renderer.render();
	frame();
}

function frame () {

	requestAnimationFrame(frame);


	update();
	draw();
}

function draw () {

}

var angle = 0;

function d2r (d){
	return d * Math.PI/180;
};

function update () {
	renderer.render();

	c.position.x = 3 * Math.sin(angle);
	c.position.y = 3 * Math.cos(angle);

	angle += d2r(0.5);
}
