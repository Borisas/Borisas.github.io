
var canvas = null;
var context = null;

var sw = null;
var sh = null;

var script = "";
var sortf = function(){};

var data = [];
var ow = 0;

var u = {
  swap : function(d,i,j){
    var a = Number(d[i]);
    d[i] = d[j];
    d[j] = d[i];
  },
  ri : function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  rf : function(min, max) {
    return Math.random() * (max - min) + min;
  }
}

window.onload = function(){

  canvas = document.getElementById('visual');
  context = canvas.getContext('2d');


  sw = function(){ return canvas.width; };
  sh = function(){ return canvas.height; };

  ResetData();
  ShuffleData();
  Start();
}

function ResetData() {

  data = [];

  var data_size = 64;

  for ( var i = 0; i < data_size; i++ ) {
    data.push(i * 1/data_size);
  }

  ow = sw() / data_size;
}

function ShuffleData() {

  for ( var i = 0; i < data.length*10; i++ ) {

    var a = u.ri(0, data.length-1);
    var b = u.ri(0,data.length-1);

    var t = data[a];
    data[a] = data[b];
    data[b] = t;
  }
  isDone = false;
  sort_i = 0;
  sort_j = 0;
}

function SortData() {
  data.sort();
}

function Start() {

  Update();
}

function Update() {

  requestAnimationFrame(Update);

  context.clearRect(0,0,sw(),sh());


  for ( var i = 0; i < data.length; i++ ) {

    var fs = context.fillStyle;
    
    context.fillStyle = 'rgba(255,255,255,'+data[i]+')';
    context.fillRect(i*ow, 0, ow, sh());
    context.fillStyle = fs;
  }
  try {
    call(data, sort_i, sort_j);
  }
  catch(e) {
    console.error("BAD SCRIPT");
    console.error(e);
  }
}


var sort_i = 0;
var sort_j = 0;

var isDone = false;

function call(d,i,j) {
  if ( isDone )
    return;

  sortSingleFrame(d,i,j);
}

function sortSingleFrame(d,i,j) {

  if ( d[i] > d[j] ) {
    var t = d[i];
    d[i] = d[j];
    d[j] = t;
  }

  i++;

  if ( i >= d.length ) {
    i = 0;
    j++;
    if ( j >= d.length ) {
      j = 0;
      i = 0;
      isDone = true;
    }
  }

  sort_i = i;
  sort_j = j;
}

function LoadNewScript() {

  var scriptdom = document.getElementById('code');
  var script = scriptdom.value;

  var newfun = null;
  try {
    newfun = new Function(script);
    newfun([1,2,3],0,0);
  }
  catch(e){
    console.error("SYNTAX ERROR IN FUNCTION");
    console.error(e);
    return;
  }

  sortSingleFrame = newfun;

  ShuffleData();
}

function Stop() {
  isDone = true;
}