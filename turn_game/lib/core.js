
sjs.u = {
  d2r : function(a) {
    return a;
  },
  r2d : function(a) {
    return a;
  }
}

sjs.p = function(x,y) {
  this.x = x || 0;
  this.y = y || 0;

  this.cp = function(o){ 
    this.x = o.x;
    this.y = o.y;
  }

  this.gcp = function() {
    return new sjs.p(this.x, this.y);
  }

  this.getRotated = function(angle) {
    
    var a = sjs.u.d2r(angle);

    var c = Math.cos(a);
    var s = Math.sin(a);

    var xnew = this.x * c - this.y * s;
    var ynew = this.x * s + this.y * c;

    return new sjs.p(xnew,ynew);
  }

  this.rotate = function(angle) {
    
    var a = sjs.u.d2r(angle);

    var c = Math.cos(a);
    var s = Math.sin(a);

    var xnew = this.x * c - this.y * s;
    var ynew = this.x * s + this.y * c;

    this.x = xnew;
    this.y = ynew;
  }
}

sjs.sz = function(w,h) {
  this.w = w || 0;
  this.h = h || 0;

  this.cp = function(o) {
    this.w = o.w;
    this.h = o.h;
  }

  this.gcp = function() {
    return new sjs.sz(this.w, this.h);
  }
}

sjs.c4f = function(r,g,b,a) {
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;
  this.a = a || 1;

  this.cp = function(o) {
    this.r = o.r;
    this.g = o.g;
    this.b = o.b;
    this.a = o.a;
  }

  this.gcp = function() {
    return new sjs.c4f(this.r, this.g, this.b, this.a);
  }

  this.getFS = function() {
    return "rgba("+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+","+this.a+")";
  }
}

sjs.rndr = function() {
  
  this.zeroPos = new sjs.p();
  this.drawPos = new sjs.p();
  this.anchor = new sjs.p();
  this.size = new sjs.sz();
  this.aabb = new sjs.sz();
  this.color = new sjs.c4f();
  this.scale = new sjs.p();
  this.rotation = 0;

};

sjs.files_to_load = [];

sjs.res = {};

sjs.vs = function() {
  return new sjs.sz(this.canvas.width, this.canvas.height);
}

sjs.load = function(farr) {
  console.log(typeof farr);
  if ( farr.constructor !== Array ) {
    throw("Files to load isn't an array.");
    return;
  }

  sjs.files_to_load = farr;

  if ( farr.length > 0 )
    sjs.__la(0);
};

sjs.onload = function() {
  console.log("LOADED");
}

sjs.__la = function(i) {

  if ( i === sjs.files_to_load.length-1 ) {
    sjs.__lf(sjs.files_to_load[i], sjs.onload);
    console.log("HUH");
  }
  else {
    sjs.__lf(sjs.files_to_load[i], function(){ sjs.__la(i+1); });
  }
}

sjs.__lf = function(file, nxt) {
  var img = new Image();
  img.src = file;

  img.onload = function(ev){
    sjs.res[file] = ev.path[0];
    nxt();
  }
}