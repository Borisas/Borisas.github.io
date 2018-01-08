
sjs.layer = function() {

  sjs.node.call(this);

  this.draw = function() {

    var t = this.__getTransform();

    if ( t.color.a > 0 ) {
      
      var fs = sjs.context.fillStyle;
      sjs.context.fillStyle = t.color.getFS();

      sjs.context.fillRect(
        t.drawPos.x - t.anchor.x * t.aabb.w, 
        t.drawPos.y - t.anchor.y * t.aabb.h, 
        t.aabb.w, 
        t.aabb.h);

      sjs.context.fillStyle = fs;
    }
  }
}