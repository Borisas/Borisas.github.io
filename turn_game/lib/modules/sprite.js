
sjs.sprite = function(file) {

  sjs.node.call(this);

  if ( !file ) {
    throw("SPRITE HAS NO FILE");
    return;
  }

  if ( !sjs.res[file] ) {
    throw("RESOURCE NOT FOUND.");
    return;
  }
  this.img = sjs.res[file];

  this.size.w = this.img.width;
  this.size.h = this.img.height;

  this.draw = function() {

    var t = this.__getTransform();

    sjs.context.drawImage(
      this.img,
      t.drawPos.x - t.aabb.w * t.anchor.x, 
      t.drawPos.y - t.aabb.h * t.anchor.y,
      t.aabb.w, t.aabb.h
    );

  }
}