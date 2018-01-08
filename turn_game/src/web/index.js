

window.onload = function() {

  var canvas = document.getElementById('game');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  sjs.init(canvas);  

  sjs.onload = function() {

    sjs.scenes.push(new SceneMain());
    sjs.start();
  }

  sjs.load([
    "res/design/logo.png"
  ]);
};
