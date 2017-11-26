
var canvas = null;
var context = null;

var vs = { w : 0, h : 0 };

var u = {
  sigmoid : function(x) { //sigmoid function
    return 1 / ( 1 + Math.pow(Math.E, -x) );
  },
  sigmoid_deriv : function(x) { //sigmoid derivative function
    return x * ( 1-x );
  },
  stepf : function(x) { //step function
    return Number(x>=0);
  },
  ri : function(min, max) { // random int
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  rf : function(min, max) { //random float
    return Math.random() * (max - min) + min;
  },

  t_2d : function(a) {  //transpose 2d array
    
    var t = [];

    for ( var i = 0; i < a.length; i++ ) {
      for ( var j = 0; j < a[i].length; j++ ) {
        if ( !t[j] )
          t[j] = [];
        t[j][i] = a[i][j]
      }
    }
    return t;
  },
  mp : function(a,b){ //multiple 2d and 1d array

    var r = [];
    for ( var i = 0; i < a.length; i++ ) {
      var s = 0;
      for ( var j = 0; j < a[i].length; j++ ) {
        s += a[i][j];
      }
      r.push(b[i]*s);
    }

    return r;
  },
  sum_a : function(a) { //array sum
    var s = 0;
    for ( var i = 0; i < a.length; i++ ) {
      s += a[i];
    }
    return s;
  }
};


var nn = {

  input : [],

  layers : [
  ],
  
  output : [],
  input_count :4,
  output_nodes : 2,

  h_layers : 1,
  h_layers_l : 8,

  dc : 0,

  learning_rate : 0.1,

  redraw : true,

  init : function () {

    this.input = [];
    this.layers = [];
    this.output = [];
    this.redraw = true;
    this.dc = 0;

    for ( var i = 0; i < this.input_count; i++ ) {
      
        var n = new Node();
        this.input.push(n);
      }
      
      for ( var j = 0; j < this.h_layers ; j++ ) {
        var s = j == 0 ? this.input.length : this.layers[j-1].length;
        this.layers.push([]);
        for ( var i = 0; i < this.h_layers_l; i++ ) {
          var n = new Node();
          n.init(s);
          this.layers[j].push(n);
        }
      }
      
      
      for ( var i = 0; i < this.output_nodes; i++ ) {
      
        var n = new Node();
        n.init(this.layers[this.layers.length-1].length);
        this.output.push(n);
      }
  },

  draw : function() {

    if ( !this.redraw )
      return;

    if ( this.dc ) {
      
      var css_b = context.strokeStyle;

      var last = this.input;

      for ( var i = 0; i < this.layers.length; i++ ) {

        for ( var j = 0; j < this.layers[i].length; j++ ) {

          for ( var k = 0; k < this.layers[i][j].weights.length; k++ ) {

            var p = last[k].dpos;
            var mp = this.layers[i][j].dpos;

            var w = u.sigmoid(this.layers[i][j].weights[k]);



            context.beginPath();
            context.moveTo(p.x,p.y);
            context.lineTo(mp.x,mp.y);
            context.strokeStyle = 'hsl('+(w*120)+',100%,50%)';
            context.stroke();
          }
        }
        last = this.layers[i];

        this.redraw = false;
      }

      for ( var i = 0; i < this.output.length ; i++ ) {

        for ( var k = 0; k < this.output[i].weights.length; k ++ ) {
          
          var p = last[k].dpos;
          var mp = this.output[i].dpos;

          var w = u.sigmoid(this.output[i].weights[k]);

          context.beginPath();
          context.moveTo(p.x,p.y);
          context.lineTo(mp.x,mp.y);
          context.strokeStyle = 'hsl('+(w*120)+',100%,50%)';
          context.stroke();
        }
      }
      context.strokeStyle = css_b;
    }

    var max_node_size = vs.h*0.1;

    var sz = vs.h* 0.8 / (this.input.length-1);
    sz = sz > max_node_size ? max_node_size : sz;

    var ix = 0 + vs.w * 0.1;
    var iy = 0 + vs.h * 0.5 - sz * (this.input.length-1) /2;
    var h = sz;

    for ( var i = 0; i < this.input.length; i++ ) {
      context.beginPath();
      context.arc(ix,iy + h * i,sz/3,0,2*Math.PI);
      context.closePath();
      var c = Math.floor(this.input[i].val * 255);
      context.fillStyle = 'rgb('+c+','+c+','+c+')';
      context.fill();
      context.stroke();

      this.input[i].dpos.x = ix;
      this.input[i].dpos.y = iy + h * i;
    }
    
    var mix = vs.w * 0.3;
    var max = vs.w * 0.7;

    var msz = (max-mix)/(this.layers.length+1);
    msz = msz > max_node_size ? max_node_size : msz;

    for ( var j = 0; j < this.layers.length; j++ ) {
      
      sz = vs.h * 0.8 / (this.layers[j].length+1); 
      sz = sz > max_node_size ? max_node_size : sz;

      sz = sz < msz ? sz : msz;
      h = sz;
      ix = vs.w * 0.5 - msz*((this.layers.length-1)/2) + msz * j ;
      iy = 0 + vs.h * 0.5 - sz * (this.layers[j].length-1) /2;

      for ( var i = 0; i < this.layers[j].length; i++ ) {
        context.beginPath();
        context.arc(ix,iy + h * i,sz/3,0,2*Math.PI);
        context.closePath();
        var c = Math.floor(this.layers[j][i].val * 255);
        context.fillStyle = 'rgb('+c+','+c+','+c+')';
        context.fill();
        context.stroke();

        this.layers[j][i].dpos.x = ix;
        this.layers[j][i].dpos.y = iy + h * i;

      }
      ix += h;
    }

    sz = vs.h * 0.8 / (this.output.length-1) ;
    sz = sz > max_node_size ? max_node_size : sz;

    var h = sz;
    ix = vs.w * 0.9;
    iy = vs.h * 0.5 - (this.output.length-1) * 0.5 * h;
    for ( var i = 0; i < this.output.length; i++ ) {
      context.beginPath();
      context.arc(ix,iy + h * i,h/3,0,2*Math.PI);
      context.closePath();

      var c = Math.floor(this.output[i].val * 255);
      context.fillStyle = 'rgb('+c+','+c+','+c+')';
      context.fill();
      context.stroke();

      this.output[i].dpos.x = ix;
      this.output[i].dpos.y = iy + h * i;
    }

    this.dc = 1;


    
  },

  getLayer : function(n) {
    if ( n >= 0 && n < this.getLayerCount() ) {
      
      if ( n === 0 ) {
        return this.input;
      }
      else if ( n === this.getLayerCount() -1 ) {
        return this.output;
      }

      else {
        return this.layers[n-1];
      }

    }
    return null;
  },
  getLayerCount : function() {
    return 2 + this.layers.length;
  },
  getLayerWeights : function(sl){

    var weights = [];

    for ( var i = 0; i < sl.length; i++ ) {
      var w = [];
      for (var j = 0; j < sl[i].weights.length; j++ ) {
        w.push(sl[i].weights[j]);
      }
      weights.push(w);
    }
    return weights;
  },
  getLayerValues : function(sl) {

    var r = [];
    for ( var i = 0; i < sl.length; i++ ) {
      r.push(sl[i].val);
    }
    return r;
  },

  passInput : function(inp) {

    for ( var i = 0; i < inp.length; i++ ) {
      this.input[i].val = inp[i];
    }

    var last = this.input;
    var next = this.layers[0];
    var t = 0;

    while ( next !== null ) {
      for ( var i = 0; i < next.length; i++ ) {

        var sum = 0;

        for ( var j = 0; j < next[i].weights.length; j++ ) {

          sum += next[i].weights[j] * last[j].val;
        }

        next[i].val = u.sigmoid(sum + next[i].bias);
      }
      t++;
      if ( this.layers.length > t && t > 0  ) {
        last = next;
        next = this.layers[t];
      }
      else if ( t > 0 ) {
        last = next;
        next = this.output;
        t = -1;
      }
      else {
        next = null;
        break;
      }
    }
    this.redraw = true;
  },

  learn : function (inp, out) {

    if ( out.length !== this.output.length ) {

      throw("Given output doesn't match, nn output format.");
      return;
    }

    this.passInput(inp);

    var sl_i = this.getLayerCount()-1;
    var sl = this.getLayer(sl_i);
    var ll = [];

    var error = [];
    var edelta = [];

    for ( sl_i; sl_i > 0; sl_i -- ) {
      sl = this.getLayer(sl_i);

      var ea = [];
      var ead = [];
      if ( sl_i === this.getLayerCount() - 1 ) {
        for ( var i = 0; i < out.length; i++ ) {

          var vm = sl[i].val;
          var ve = out[i];
          var e = ve-vm;

          ea.push(e);
          ead.push(e * u.sigmoid_deriv(vm));
        }
      }
      else {

        var weights = this.getLayerWeights(ll);
        var w_t = u.t_2d(weights);
        // console.log(w_t);
        console.log(w_t);

        for ( var i = 0; i < ll.length; i++ ) {

          var w = u.sum_a(weights[i]);
          console.log(w);
          var d = error[0][i];
          var e = w*d;

          ea.push(e);
          ead.push(e * u.sigmoid_deriv(e)); 
        }
      }
      ll = sl;
      error.splice(0,0,ea);
      edelta.splice(0,0,ead);
    }

    console.log(error);
    console.log(edelta);
  }
};

function Node() {
  this.val = 0;
  this.weights = [];
  this.bias = 0;

  this.dpos = { x : 0, y : 0 };

  this.init = function(c) {
    for ( var i = 0; i < c; i++ ) {
      this.weights.push(u.rf(-20,20));
    }
    this.bias = u.ri(-20,20);
  }
};




window.onload = function() {

  canvas = document.getElementById('v');
  context = canvas.getContext('2d');

  vs.w = canvas.width;
  vs.h = canvas.height;

  nn.init();
  loop();
};


function loop () {
  
  requestAnimationFrame(loop);

  if ( nn.redraw ) {
    var fs_b = context.fillStyle;
    context.fillStyle = 'gray';
    context.fillRect(0,0,vs.w,vs.h);
    context.fillStyle = fs_b;

    nn.draw();
  }
}