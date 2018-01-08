
sjs.node = function() {

  this.alive = true;

  this.pos = new sjs.p();
  this.anchor = new sjs.p(0.5,0.5);
  this.color = new sjs.c4f();
  this.size = new sjs.sz();
  this.sx = 1;  //scaleX
  this.sy = 1;  //scaleY
  this.rotation = 0;
  this.visible = true;

  this.zIndex = 0;

  this.parent = null;
  this.children = [];

  this.__childrenSorted = false;
  this.__dirty = true;
  this.__inheritColor = false;
  this.__inheritOpacity = false;
  this.__latestRenderData = new sjs.rndr();

//-----------
//  SETTERS

  this.setPosition = function(x, y) {
    this.pos.x = x;
    this.pos.y = y;

    this.__dirty = true;
  }
  this.setPositionX = function(x) {
    this.setPosition(x, this.pos.y);
  }
  this.setPositionY = function(y) {
    this.setPosition(this.pos.x, y);
  }

  this.setScale = function(x,y) {
    y = y || x;
    this.sx = x;
    this.sy = y;

    this.__dirty = true;
  }
  this.setScaleX = function(x) {
    this.setScale(x, this.sy);
  }
  this.setScaleY = function(y) {
    this.setScale(this.sx, y);
  }

  this.setSize = function(w,h) {
    this.size.w = w;
    this.size.h = h;

    this.__dirty = true;
  }
  this.setSizeWidth = function(w) {
    this.setSize(w, this.size.h);
  }
  this.setSizeHeight = function(h) {
    this.setSize(this.size.w, h);
  }

  this.setRotation = function(rot) {
    this.rotation = rot;

    this.__dirty = true;
  }

  this.setAnchorPoint = function(ax, ay) {
    this.anchor.x = ax;
    this.anchor.y = ay;

    this.__dirty = true;
  }

  this.setColor = function(r,g,b) {
    this.color.r = r;
    this.color.g = g;
    this.color.b = b;

    this.__dirty = true;
  }

  this.setOpacity = function(o) {
    this.color.a = o;

    this.__dirty = true;
  }

  this.setVisible = function(v) {
    this.visible = v;
  }

//-----------
//  GETTERS

  this.getPosition =    () => this.pos.gcp();
  this.getPositionX =   () => this.pos.x;
  this.getPositionY =   () => this.pos.y;

  this.getScale = () => this.sx;
  this.getScaleX = () => this.sx;
  this.getScaleY = () => this.sy;

  this.getSize = () => this.size.gcp();

  this.getRotation = () => this.rotation;

  this.getAnchorPoint = () => this.anchor.gcp();

  this.getColor = () => this.color.gcp();

  this.getOpacity = () => this.opacity;

  this.isVisible = () => this.visible; 

//-----------
//  CORE

  this.addChild = function(n, z) {
    n.__dirty = true;
    n.parent = this;
    n.zIndex = z || 0;
    this.__childrenSorted = false;
    this.children.push(n);
  }

  this.removeFromParent = function() {

    if ( this.parent ) {
      this.parent.removeChild(this);
    }
  }

  this.removeChild = function(c) {

    for ( var i = 0; i < this.children.length; i++ ) {
      
      if ( this.children[i] == c ) {
        this.children.splice(i,1);
        c.parent = null;
        this.__childrenSorted = false;
        return;
      }
    }
  }

  this.draw = function(){};
  this.update = function(){};


  this.__tree = function(dt){

    this.update(dt);
    this.draw();

    if ( !this.__childrenSorted ) {
      this.children.sort( function(a,b) {
        return a.zIndex > b.zIndex;
      });
      this.__childrenSorted = true;
    }

    for ( var i = 0; i < this.children.length; i++ ) {
      this.children[i].__tree(dt);
    }


  };

  this.__getTransform = function() {


    if ( !this.__dirty ) {
      return this.__latestRenderData;
    }
  
    var pr = new sjs.rndr();
    
    if ( this.parent !== null ) {
      pr = this.parent.__getTransform();
    }
    else {
      pr.scale.x = 1;
      pr.scale.y = 1;
    }

    var mr = new sjs.rndr();

    mr.zeroPos.cp(this.pos);
    mr.drawPos.cp(this.pos);
    mr.anchor.cp(this.anchor);
    mr.color.cp(this.color);
    mr.scale = new sjs.p(this.sx, this.sy);
    mr.size.cp(this.size);
    mr.rotation = this.rotation;

    if ( this.__inheritColor ) {
      mr.color.r *= this.color.r;
      mr.color.b *= this.color.b;
      mr.color.g *= this.color.g;
    }

    if ( this.__inheritOpacity ) {
      mr.color.a *= this.color.a;
    }

    var zposdiff = new sjs.p(
      -1 * mr.anchor.x * mr.size.w * mr.scale.x * pr.scale.x,
      -1 * mr.anchor.y * mr.size.h * mr.scale.y * pr.scale.y
    );

    var zpr = zposdiff.getRotated(mr.rotation);
    mr.zeroPos.x += zpr.x;
    mr.zeroPos.y += zpr.y;

    mr.zeroPos.rotate(pr.rotation);
    mr.zeroPos.x += pr.zeroPos.x;
    mr.zeroPos.y += pr.zeroPos.y;

    mr.drawPos.x *= pr.scale.x;
    mr.drawPos.y *= pr.scale.y;

    mr.drawPos.rotate(pr.rotation);
    
    mr.drawPos = new sjs.p(
      pr.zeroPos.x + mr.drawPos.x,
      pr.zeroPos.y + mr.drawPos.y
    );
    
    mr.scale.x *= pr.scale.x;
    mr.scale.y *= pr.scale.y;
  
    mr.aabb = new sjs.sz(
      this.size.w * mr.scale.x,
      this.size.h * mr.scale.y
    );

    mr.rotation += pr.rotation;
  
    this.__latestRenderData = mr;
    this.__dirty = false;
  
    for ( var i = 0; i < this.children.length; i++ ) {
      this.children[i].__dirty = true;
    }
  
    return mr;
  };
}