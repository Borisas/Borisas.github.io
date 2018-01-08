
sjs.running = false;

sjs.scenes = [];

sjs.fc = {
  dt : 0.0016,
  tl : -1
}

sjs.clearColor = 'rgb(255,255,255)';

sjs.start = function() {
  if ( !sjs.running ) {
    sjs.running = true;
    sjs.loop();
  }
}

sjs.pause = function () {
  sjs.running = false;
}

sjs.loop = function() {

  if ( sjs.running === true ) {
    requestAnimationFrame(sjs.loop);
  }

  var tn = performance.now();
  if ( sjs.fc.tl !== -1 ) 
    sjs.fc.dt = (tn - sjs.fc.tl)/1000;
  sjs.fc.tl = tn;

  sjs.context.clearRect(0,0,sjs.canvas.width,sjs.canvas.height);

  if ( sjs.scenes.length > 0 ) {
    sjs.scenes[0].__tree(sjs.fc.dt);
  }
}

sjs.onresize = function() {

  if ( sjs.canvas ) {
    // sjs.canvas.width = window.innerWidth;
    // sjs.canvas.height = window.innerHeight;

    sjs.canvas.style.width = "100%";
    sjs.canvas.style.height = "100%";
  }
}