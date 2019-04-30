
var canvas = null;
var context = null;

{//PRIVATE
	var __program_start = 0;

	var __last_frame = 0;

	var __font_size = 30;
	var __font_name = "Arial";

	var __width = 0;
	var __height = 0;
}

{//PUBLIC

	var DELTA = 0;
	var ALIGN_CENTER = "center";
	var ALIGN_LEFT = "left";
	var ALIGN_RIGHT = "right";

	var KEY_DOWN = null;
}
window.onload = __start;
window.addEventListener('keydown', __inputDown);
window.addEventListener('keyup', __inputUp);


function __inputDown(e) {

	var newcode = KEY_DOWN != e.code;
	KEY_DOWN = e.code;

	if ( typeof(onKeyDown) != "undefined" ) {
		if ( newcode ) onKeyDown();
	}
}

function __inputUp(e) {

	KEY_DOWN = null;

	if ( typeof(onKeyUp) != "undefined" ) {
		onKeyUp();
	}
}

function __start() {
	if ( typeof(setup) != "undefined" ) {	//JAVASCRIPT.
		setup();
	}

	setTimeout(__run, 1000/60);
}

function __run() {

	var t0 = millis();
	if ( typeof(draw) != "undefined" ) {	//JAVASCRIPT.
		draw();
	}
	var t1 = millis();

	currentFrame = millis();
	DELTA = currentFrame - __last_frame;
	__last_frame = currentFrame;

	if ( t1-t0 >= 1000/60) {
		__run();
	}
	else {
		setTimeout(__run, 1000/60 - (t1-t0));
	}
}


function init(w,h,scale=false){

	canvas = document.getElementById('main');
	canvas.width = w;
	canvas.height = h;
	canvas.style.display = "block";

	if ( scale ) {
		
		var tw = document.body.offsetWidth * 0.95;
		var th = tw * (h/w);

		var scale = tw / w;
		if ( scale < 1 ) {
			canvas.style.transform = "scale("+scale+")";
			canvas.style.transformOrigin = "top left";
		}
	}

	__width = w;
	__height = h;
	
	context = canvas.getContext('2d');

	__program_start = (new Date()).getTime();

	context.textBaseline = "middle";
}

function clear(){

	context.clearRect(0,0,__width,__height);
}

function backgroundStyle(r,g,b){

	if ( r < 0 ) r = 0;
	else if ( r > 255 ) r = 255;

	if ( g < 0 ) g = 0;
	else if ( g > 255 ) g = 255;

	if ( b < 0 ) b = 0;
	else if ( b > 255  ) b = 255;

	canvas.style.background = "rgb("+r+","+g+","+b+")";
}

function rect(x,y,w,h){
	context.fillRect(x,y,w,h);
	context.strokeRect(x,y,w,h);
	context.stroke();
}

function ellipse(x,y,r) {

	context.beginPath();
	context.arc(x,y,r,0,2*Math.PI);
	context.stroke();
	context.fill();
	context.closePath();
}

function line(x0,y0,x1,y1) {

	context.beginPath();
	context.moveTo(x0,y0);
	context.lineTo(x1,y1);
	context.stroke();
	context.closePath();

}

function textAlign(al) {

	context.textAlign = al;
}

function text(x,y,text) {
	context.fillText(text, x, y);
}

function textSize(sz) {

	__font_size = sz;
	context.font = __font_size +"px "+__font_name;
}

function textFont(name) {

	__font_name = name;
	context.font = __font_size +"px "+__font_name;
}

function fill(r,g,b) {

	if ( r < 0 ) r = 0;
	else if ( r > 255 ) r = 255;

	if ( g < 0 ) g = 0;
	else if ( g > 255 ) g = 255;

	if ( b < 0 ) b = 0;
	else if ( b > 255  ) b = 255;

	context.fillStyle = "rgb("+r+","+g+","+b+")";
}

function stroke(r,g,b){

	if ( r < 0 ) r = 0;
	else if ( r > 255 ) r = 255;

	if ( g < 0 ) g = 0;
	else if ( g > 255 ) g = 255;

	if ( b < 0 ) b = 0;
	else if ( b > 255  ) b = 255;

	context.strokeStyle = "rgb("+r+","+g+","+b+")";
}

function lineWidth(sz) {

	context.lineWidth = sz;
}

function millis() {
	return (new Date()).getTime() - __program_start;
}

function randomElement(arr) {

	return arr[Math.floor(Math.random()*arr.length)];
}

function randomInteger(from, to) {
	return Math.floor(Math.random() * (to - from + 1)) + from;
}

function randomFloat(from, to) {
	return Math.random() * (to - from) + from;
}

function sigmoid(x) {

	return ( Math.pow(Math.E, x) / ( Math.pow(Math.E,x) + 1));
}