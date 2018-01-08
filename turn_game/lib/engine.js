var sjs = {};

sjs.canvas = null;
sjs.context = null;

sjs.init = function(canvas){
  sjs.canvas = canvas;
  sjs.context = canvas.getContext('2d');
  window.onresize = sjs.onresize;
}