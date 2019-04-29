function Renderer3D() {

	this.plane = null;

	this.objects = [];

	this.pw = 100; // Plane Width
	this.ph = 100; // Plane Height
	this.pd = 100; // Plane Depth

	this.dom = null;
	this.context = null;

	this.width = 800;
	this.height = 600;

	this.camera = p( 10,5,0 );
	this.fov = 90;
	this.crot = p(0,0,0);
};

Renderer3D.prototype.init = function () {
	this.dom = document.createElement('canvas');
	this.dom.width = this.width;
	this.dom.height = this.height;

	this.dom.style.border = "1px solid black";
	this.dom.style.margin = "auto";
	this.dom.style.display = "block";
	// this._fillPlane();

	this.context = this.dom.getContext('2d');
};

Renderer3D.prototype.render = function () {

	var ctx = this.dom.getContext('2d');
	ctx.fillStyle='#ffffff';
	ctx.fillRect(0,0,this.width,this.height);

	var crx = Math.PI-this.crot.x;
	var cry = Math.PI-this.crot.y;
	var crz = Math.PI-this.crot.z;

	// console.log(ccos+":"+csin);

	for ( var i in this.objects ) {

		var o = this.objects[i];
		var op = p3(o.position.x, o.position.y , o.position.z);

		// op = rot3XVec(op, crx);
		// op = rot3YVec(op, cry);
		// op = rot3ZVec(op, crz);

		for ( var j = 0; j < o.lines.length; j++ ) {

			var c = p3 ( this.camera.x, this.camera.y, this.camera.z);


			var l = o.getLinePosition(j);

			var ps = p3 ( l.s.x + op.x - c.x, l.s.y + op.y - c.y , l.s.z + op.z - c.z );
			var pe = p3 ( l.e.x + op.x - c.x, l.e.y + op.y - c.y , l.e.z + op.z - c.z );

			// ps = rot3XVec(ps,crx);
			// ps = rot3YVec(ps,cry);
			// ps = rot3ZVec(ps,crz);
			//
			// pe = rot3XVec(pe,crx);
			// pe = rot3YVec(pe,cry);
			// pe = rot3ZVec(pe,crz);


			var rs = (ps.z) * Math.sin(d2r(this.fov));

			var modxs = this.width/rs,
				modys = this.height/rs;

			var drawps = p2((ps.x) * modxs + this.width/2,
							(ps.y) * modys + this.height/2);



			var re = (pe.z) * Math.sin(d2r(this.fov));

			var modxe = this.width/re,
				modye = this.height/re;

			var drawpe = p2((pe.x) * modxe + this.width/2, (pe.y) * modye+this.height/2);


			drawLine(this.context, drawps,drawpe);
		}
		for ( var j = 0; j < o.faces.length; j++ ){

			var c = p3 ( this.camera.x, this.camera.y, this.camera.z);

			var f = o.getFacePosition(j);
			var poly = [];

			for ( var k = 0; k < f.v.length; k++ ){

				var fp = f.v[k];

				var pos = p3 (fp.x+op.x-c.x,fp.y+op.y-c.y,fp.z+op.z-c.z );


				// var pos = rot3XVec ( pos, crx );
				// 	pos = rot3YVec ( pos, cry );
				// 	pos = rot3ZVec ( pos, crz );

				var r = (pos.z) * Math.sin(d2r(this.fov));

				var modx = this.width/r,
				 	mody = this.height/r;

				var pointp = p2 ( (pos.x) * modx + this.width/2, (pos.y) * mody+this.height/2);

				poly.push(pointp);
			}
			fillPoly(this.context, poly,f.c);
		}
	}

};


function Obj3D () {

	this.vertexes = [];
	this.lines = [];
	this.faces = [];
	this.position = p(0,0,0);
	this.rotation = p(0,0,0);

	this.getLinePosition = function (id,camrot) {
		if ( id >= this.lines.length )
			return null;

		var l = this.lines[id];
		var v = this.getVertices(camrot);
		return {
			s : p(v[l.s].x,v[l.s].y,v[l.s].z),
			e : p(v[l.e].x,v[l.e].y,v[l.e].z)
		};
	};

	this.getFacePosition = function (id,camrot) {
		if ( id >= this.faces.length)
			return null;

		var f = this.faces[id];
		var v = this.getVertices(camrot);

		var ret = [];
		for ( var i = 0; i < f.v.length; i++ ) {
			ret.push (v[f.v[i]]);
		}
		return { v : ret, c : f.color };
	}

	this.getVertices = function (addrot) {
		addrot = addrot || p(0,0,0);

		var v = this.vertexes;
		v = rot3X(v,this.rotation.x+addrot.x);
		v = rot3Y(v,this.rotation.y+addrot.y);
		v = rot3Z(v,this.rotation.z+addrot.z);
		return v;
	};

};

function rot3X ( v, angle ) {
	var ret = [];
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	for ( var i = 0; i < v.length; i++ ) {
		ret.push(
			p3(
				Number(v[i].x)*c - Number(v[i].z)*s,
				Number(v[i].y),
				Number(v[i].x)*s + Number(v[i].z)*c
			)
		);
	}

	return ret;
}

function rot3Y ( v, angle ) {
	var ret = [];
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	for ( var i = 0; i < v.length; i++ ) {
		ret.push (
			p3(
				Number(v[i].x),
				Number(v[i].y) * c - Number(v[i].z)*s,
				Number(v[i].y) * s + Number(v[i].z)*c
			)
		);
	}
	return ret;
}

function rot3Z ( v, angle ) {
	var ret = [];
	var s = Math.sin(angle);
	var c = Math.cos(angle);

	for ( var i = 0; i < v.length; i++ ) {
		ret.push (
			p3(
				Number(v[i].x) * c - Number(v[i].y)*s,
				Number(v[i].x) * s + Number(v[i].y)*c,
				Number(v[i].z)
			)
		);
	}
	return ret;
}

function rot3XVec ( vec, angle ) {

	var cos = Math.cos(angle);
	var sin = Math.sin(angle);

	vec.x = Number(vec.x)*cos - Number(vec.z)*sin;
	vec.z = Number(vec.x)*sin + Number(vec.z)*cos;
	return vec;
}
function rot3YVec ( vec, angle ) {

	var cos = Math.cos(angle);
	var sin = Math.sin(angle);

	vec.y = Number(vec.y) * cos - Number ( vec.z ) * sin;
	vec.z = Number(vec.y) * sin + Number ( vec.z ) * cos;
	return vec;
}
function rot3ZVec ( vec, angle ) {

	var cos = Math.cos(angle);
	var sin = Math.sin(angle);

	vec.x = Number(vec.x) * cos - Number ( vec.y ) * sin;
	vec.y = Number(vec.x) * sin + Number ( vec.y ) * cos;
	return vec;
};

function p2(x,y){
	return new (function() { this.x = x; this.y = y; })();
};

function p(x,y,z){
	return new (function() { this.x = x; this.y = y; this.z = z; })();
};
var p3 = p;
function line(a,b){
	return new (function() { this.s = a; this.e = b; })();
};

function vtx(point,c){
	var v = {
		p : point,
		c : c
	};
	return v;
}

function drawPoly ( ctx, v ) {

	if ( v.length < 3 ) {
		throw('Poly can\'t have less than 3 points.');
	}

	ctx.strokeStyle = '#000000';
	ctx.beginPath(0);
	ctx.moveTo(v[0].x,v[0].y);

	for ( var i = 1; i < v.length; i++ ) {
		ctx.lineTo(v[i].x, v[i].y);
	}
	ctx.lineTo(v[0].x, v[0].y);
	ctx.closePath();
	ctx.stroke();
};

function fillPoly (ctx , v, c ) {
	ctx.fillStyle = c || '#000000';
	ctx.beginPath(0);
	ctx.moveTo(v[0].x,v[0].y);

	for ( var i = 1; i < v.length; i++ ) {
		ctx.lineTo(v[i].x, v[i].y);
	}
	ctx.lineTo(v[0].x, v[0].y);
	ctx.closePath();
	ctx.fill();
}

function drawDot ( ctx, pos ) {
	ctx.fillStyle = '#000000';
	ctx.fillRect(pos.x-.5,pos.y-.5,1,1);
}

function drawLine ( ctx, s, e ,c ) {
	ctx.strokeStyle= c | "#000000";
	ctx.beginPath(0);
	ctx.moveTo(s.x,s.y);
	ctx.lineTo(e.x,e.y);
	ctx.closePath();
	ctx.stroke();
}


function createCube (w,h,d){
	var cube = new Obj3D();
	var v = [];

	v.push(p3(-1*w,1*h,-1*d));	//A		0
	v.push(p3(-1*w,-1*h,-1*d));	//B		1
	v.push(p3(1*w,-1*h,-1*d));	//C		2
	v.push(p3(1*w,1*h,-1*d));		//D		3
	v.push(p3(-1*w,1*h,1*d));		//A1	4
	v.push(p3(-1*w,-1*h,1*d));	//B1	5
	v.push(p3(1*w,-1*h,1*d));		//C1	6
	v.push(p3(1*w,1*h,1*d));		//D1	7
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

	var f = [];
	f.push({v :[0,1,2,3], color : "#000000"});
	cube.faces = f;

	return cube;
}
