
var canvas = null;
var context = null;

var sw = null;
var sh = null;

var script = "";
var sortf = function(){};

var data = [];
var ow = 0;

var speed = 0.05;

var data_size = 64;

var lasttm = null;

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

  demo = document.getElementById('demodisp');

  demo.innerHTML += '<b>Here\'s a Bubble Sort example:</b><br/><i>Just copy and paste it to the left, then click \'Save & Run\'</i><br/><br/>';

  var c = ''+
  'if ( i == 0 )\n'+
  '\ti = 1;\n'+
  'if ( d[i-1] > d[i] ) {\n'+
  '\tvar t = d[i-1];\n'+
  '\td[i-1] = d[i];\n'+
  '\td[i] = t;\n'+
  '\tj = 1;\n'+
  '}\n'+
  'i++;\n'+
  'if ( i >= d.length ) {\n'+
  '\ti = 1;\n'+
  '\tif ( j == 0 ) {\n'+
  '\t\tStop();\n'+
  '\t}\n'+
  '\tj = 0;\n'+
  '}\n';

  c = c.replace(/\n/g, '<br/>').replace(/\t/g, '&nbsp;');

  demo.innerHTML += c;

  ResetData();
  ShuffleData();
  Start();
}


function ResetData() {

  data = [];

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
  call();
}

function Update() {

  requestAnimationFrame(Update);

  context.clearRect(0,0,sw(),sh());


  for ( var i = 0; i < data.length; i++ ) {

    var fs = context.fillStyle;
    
    var  val = data[i] * 360;
    val = Math.floor(val);

    context.fillStyle = 'hsl('+val+',100%,50%)';
    context.fillRect(i*ow, 0, ow, sh());
    context.fillStyle = fs;
  }
}


var sort_i = 0;
var sort_j = 0;

var isDone = false;

function call(d,i,j) {
  if ( isDone )
    return;

  if ( lasttm ) {
    clearTimeout(lasttm);
  }

  lasttm = setTimeout(function(){ 
    try {
    sortSingleFrame(data,sort_i, sort_j);
    }
    catch(e){
      console.error("BAD FUNCTION.");
      console.error(e);
    }
    return;
  }, 
    speed);
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

  call();
}

function LoadNewScript() {

  var scriptdom = document.getElementById('code');
  var script = scriptdom.value;

  var h = '(function s(d,i,j){';
  script = h + script;
  script += 'sort_i = i; sort_j = j; call();})(arguments[0],arguments[1],arguments[2]);';

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

  Restart();
}

function Restart(){
  ShuffleData();
  call();
}

function Stop() {
  isDone = true;
}