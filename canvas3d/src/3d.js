function Renderer3D() {

	this.plane = null;

	this.objects = [];

	this.pw = 100; // Plane Width
	this.ph = 100; // Plane Height
	this.pd = 100; // Plane Depth

	this.dom = null;

	this.width = 800;
	this.height = 600;

	this.camera = p( this.pw/2 , 5 , 0 );
	this.fov = 90;
};

Renderer3D.prototype.init = function () {
	this.dom = document.createElement('canvas');
	this.dom.width = this.width;
	this.dom.height = this.height;

	this.dom.style.top = '50%';
	this.dom.style.left = '50%';
	this.dom.style.position='absolute';
	this.dom.style.transform = "translate(-50%,-50%)";
	this.dom.style.border = "1px solid black";
	this._fillPlane();
};

Renderer3D.prototype._fillPlane = function () {

	if ( this.plane === null ) {
		this.plane = [];
		for ( var i = 0; i < this.pw; i++ ) {
			var a2 = [];
			for ( var j = 0; j < this.ph; j++ ) {
				var a1 = [];
				for ( var k = 0; k < this.pd; k++ ) {
					a1.push(0);
				}
				a2.push(a1);
			}
			this.plane.push(a2);
		}
	}
	else {
		for ( var i = 0 ; i < this.pw; i++ ) {
			for ( var j = 0; j < this.ph; j++ ) {
				for ( var k = 0; k < this.pd; k++ ) {
					if ( this.plane[i][j][k] !== 0 )
						this.plane[i][j][k] = 0;
				}
			}
		}
	}
	return this.plane;
};
Renderer3D.prototype._projection = function () {

	var start = p ( this.camera.x, this.camera.y, this.camera.z);

	var proj = [];
	var pl = this._fillPlane();
	var lines = [];

	var self = this;

	for ( var i = 0; i < self.objects.length; i++ ) {
		(function(){
			var op = self.objects[i].position;
			var ov = self.objects[i].vertexes;

			var ol = self.objects[i].lines;

			for ( var k = 0; k < ov.length; k++ ){
				var pop = ov[k];

				pop.x += op.x;
				pop.y += op.y;
				pop.z += op.z;;

				if ( pop.x < pl.length &&
					 pop.y < pl[pop.x].length &&
				  	 pop.z < pl[pop.x][pop.y].length ) {

					pl[pop.x][pop.y][pop.z] = 1;
				}
			}

		})();
	}
	var projection = (function(){
		var mod = 1;


		var d = [];
		for ( var i = 0 ; i < self.objects.length; i++ ){

			var op = self.objects[i].position;

			for ( var k = 0; k < self.objects[i].lines.length; k++ ) {
				var line = self.objects[i].getLinePosition(k);
				var s_lmod = line.s.z - start.z+1;
				var e_lmod = line.e.z - start.z+1;

				var s_lminx = Number(start.x)-s_lmod,
					e_lminx = Number(start.x)-e_lmod,
					s_lminy = Number(start.y)-s_lmod,
					e_lminy = Number(start.y)-e_lmod;
				line.s.x -= s_lminx;
				line.s.y -= s_lminy;
				line.s.z -= start.z;

				line.e.x -= e_lminx;
				line.e.y -= e_lminy;
				line.e.z -= start.z;
				lines.push(line);
			}
		}

		for ( var k  = start.z; k < self.pd; k ++ ) {
			var minx = Number(start.x)-mod,
				maxx = Number(start.x)+mod;

			var miny = Number(start.y)-mod,
				maxy = Number(start.y)+mod;

			var w = [];

			for ( var i = minx; i <= maxx; i++ ) {

				var h = [];

				for ( var j = miny; j <= maxy; j++ ) {

					if ( j >= self.ph || j < 0 ) {
						h.push(0);
						continue;
					}
					if ( i >= self.pw || i < 0 ) {
						h.push(0);
						continue;
					}
					if ( k >= self.pd || k < 0 ) {
						h.push(0);
						continue;
					}
					h.push( pl[i][j][k] );

				}
				w.push(h);
			}
			d.push(w);
			mod+=1;
		}

		return {v : d, l : lines};
	})();

	return projection;
};

Renderer3D.prototype.render = function () {

	var ctx = this.dom.getContext('2d');
	ctx.fillStyle='#ffffff';
	ctx.fillRect(0,0,this.width,this.height);

	for ( var i in this.objects ) {

		var o = this.objects[i];
		var op = o.position;

		for ( var j = 0; j < o.lines.length; j++ ) {

			var l = o.getLinePosition(j);

			var rs = (l.s.z+op.z) * Math.sin(Math.PI/2);

			var modxs = this.width/rs,
				modys = this.height/rs;

			var drawps = p2((l.s.x+op.x) * modxs + this.width/2, (l.s.y+op.y) * modys + this.height/2);

			var re = (l.e.z+op.z) * Math.sin(Math.PI/2);

			var modxe = this.width/re,
				modye = this.height/re;

			var drawpe = p2((l.e.x+op.x) * modxe + this.width/2, (l.e.y+op.y) * modye + this.height/2);

			drawLine(this.dom.getContext('2d'), drawps,drawpe);
		}
	}

	// var pf = this._projection();
	// var pj = pf.v;
	// var pl = pf.l;
	//

	//
	// for ( var k = 0; k < pj.length; k++ ) {
	// 	for ( var i = 0; i < pj[k].length; i++ ) {
	// 		for ( var j = 0; j < pj[k][i].length; j++ ) {
	//
	// 			// var pos_multip =
	// 			var pmx = this.width/pj[k].length;
	// 			var pmy = this.height/pj[k][i].length;
	//
	// 			var el = pj[k][i][j];
	//
	// 			if ( el ) {
	// 				drawDot(this.dom.getContext('2d'), p2(pmx*i,pmy*j));
	// 			}
	// 		}
	// 	}
	// }
	//
	// for ( var o = 0 ; o < pl.length; o++ ) {
	// 	var line = pl[o];
	//
	// 	var s_depmodx = this.width/pj[line.s.z].length;
	// 	var s_depmody = this.height/pj[line.s.z][line.s.x].length;
	//
	// 	var e_depmodx = this.width/pj[line.e.z].length;
	// 	var e_depmody = this.height/pj[line.e.z][line.e.x].length;
	//
	// 	drawLine (
	// 		this.dom.getContext('2d'),
	// 		p2 ( line.s.x * s_depmodx , line.s.y * s_depmody ),
	// 		p2 ( line.e.x * e_depmodx , line.e.y * e_depmody )
	// 	);
	// }
};


function Obj3D () {

	this.vertexes = [];
	this.lines = [];
	this.position = p(0,0,0);
	this.rotation = p(0,0,0);

	this.rotateZ = function (angle) {
		var sinTheta = sin(theta);
		var cosTheta = cos(theta);
		for (var n = 0; n < nodes.length; n++) {
		var node = nodes[n];
		var y = node[1];
		var z = node[2];
		node[1] = y * cosTheta - z * sinTheta;
		node[2] = z * cosTheta + y * sinTheta;
		}
	}

	this.getLinePosition = function (id) {
		if ( id >= this.lines.length )
			return null;

		var l = this.lines[id];
		return {
			s : p(this.vertexes[l.s].x,this.vertexes[l.s].y,this.vertexes[l.s].z),
			e : p(this.vertexes[l.e].x,this.vertexes[l.e].y,this.vertexes[l.e].z)
		};
	}

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

function drawDot ( ctx, pos ) {
	ctx.fillStyle = '#000000';
	ctx.fillRect(pos.x-.5,pos.y-.5,1,1);
}

function drawLine ( ctx, s, e ) {
	ctx.strokeStyle="#000000";
	ctx.beginPath(0);
	ctx.moveTo(s.x,s.y);
	ctx.lineTo(e.x,e.y);
	ctx.closePath();
	ctx.stroke();
}
