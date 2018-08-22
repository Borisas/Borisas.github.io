
var node = function() {

	this.value = 0.0;
	this.weights = [];

};



var activation = function() {

	this.inputLayer = [];
	this.hiddenLayer = [];
	this.outputLayer = [];

};

var ai = function() {

	this.inputLayer = [];
	this.hiddenLayer = [];
	this.outputLayer = [];

	this.inputSize = 6;
	this.hiddenSize = 8;
	this.outputSize = 3;

	this.activations = [];
	this.decisions = [];
	this.lastDecision = 0;

	this.init = function() {
		
		for ( var i = 0; i < this.inputSize; i++ ) {

			var n = new node();

			for ( var j = 0; j < this.hiddenSize; j++ ) {

				n.weights.push(randomFloat(-1.0, 1.0));
			}

			this.inputLayer.push(n);
		}

		for ( var i = 0; i < this.hiddenSize; i++ ) {
			var n = new node();

			for ( var j = 0; j < this.outputSize; j++ ) {

				n.weights.push(randomFloat(-1.0,1.0));
			}

			this.hiddenLayer.push(n);
		}

		for ( var i = 0; i < this.outputSize; i++ ) {

			var n = new node();
			this.outputLayer.push(n);
		}

	};

	this.inherit = function(from, mutation) {

		mutation = typeof(mutation) == "undefined" ? 0.1 : mutation;;

		for ( var i = 0; i < this.inputSize; i++ ) {

			var n = this.inputLayer[i];
			n.value = 0;

			for ( var j = 0; j < this.hiddenSize; j++ ) {

				n.weights[j] = from.inputLayer[i].weights[j] + randomFloat(-mutation, mutation);
			}

			this.inputLayer[i] = n;

		}

		for ( var i = 0; i < this.hiddenSize; i++ ) {

			var n = this.hiddenLayer[i];
			n.value = 0;

			for ( var j = 0; j < this.outputSize; j++ ) {

				n.weights[j] = from.hiddenLayer[i].weights[j] + randomFloat(-mutation, mutation);
			}

			this.hiddenLayer[i] = n;

		}
	};

	this.makeDecision = function(input) {

		for ( var i = 0; i < this.inputSize; i++ ) {
			this.inputLayer[i].value = input[i];
		}

		for ( var i = 0; i < this.inputSize; i++ ) {

			var n = this.inputLayer[i];

			for ( var j = 0; j < this.hiddenSize; j++ ) {

				this.hiddenLayer[j].value += n.value * n.weights[j];
			}
		}


		for ( var i = 0; i < this.hiddenSize; i++ ) {

			var n = this.hiddenLayer[i];

			for ( var j = 0; j < this.outputSize; j++ ) {
				this.outputLayer[j].value += n.value * n.weights[j];
			}
		}
	}

	this.getDecision = function () {

		var largest = 0;
		var it = 0;
		var set = false;

		for ( var i = 0; i < this.outputSize; i++ ) {

			if ( set == false || largest < this.outputLayer[i].value ) {
				largest = this.outputLayer[i].value;
				it = i;
				set = true;
			}
		}

		return it;
	}

	this.recordDecision = function() {

		this.decisions.push(this.getDecision());
		this.recordActivation();
	}

	this.recordActivation = function() {
		var at = new activation();

		for ( var i = 0; i < this.inputSize; i++ ) {
			at.inputLayer.push(this.inputLayer[i].value);
		}

		for ( var i = 0; i < this.hiddenSize; i++ ) {
			at.hiddenLayer.push(this.hiddenLayer[i].value);
		}

		for ( var i = 0; i < this.outputSize; i++ ) {
			at.outputLayer.push(this.outputLayer[i].value);
		}

		this.activations.push(at);
	};

	this.resetDecision = function() {

		for ( var i = 0; i < this.inputSize; i++ ) {

			this.inputLayer[i].value = 0;
		}

		for ( var i = 0; i < this.hiddenSize; i++ ) {

			this.hiddenLayer[i].value = 0;
		}

		for ( var i = 0; i < this.outputSize; i++ ) {

			this.outputLayer[i].value = 0;
		}

	}

	this.getRecordedDecision = function() {

		if ( this.lastDecision > this.decisions.length ) return -1;

		var d = this.decisions[this.lastDecision];


		if ( this.activations.length > this.lastDecision ) {
			var at = this.activations[this.lastDecision];


			for ( var i = 0; i < this.inputSize; i++ ){
				
				this.inputLayer[i].value = at.inputLayer[i];
			}
			for ( var i = 0; i < this.hiddenSize; i++ ){
				
				this.hiddenLayer[i].value = at.hiddenLayer[i];
			}
			for ( var i = 0; i < this.outputSize; i++ ){
				
				this.outputLayer[i].value = at.outputLayer[i];
			}
		}

		this.lastDecision++

		return d;
	}

	this.resetRecords = function() {


		this.decisions = [];
		this.activations = [];
	}

	this.drawNetwork = function() {

		lineWidth(3);

		var x = 540;
		var y = 350;
		var spaceX = 100;

		var rh = ( this.hiddenSize - this.inputSize ) * 0.5;
		var ro = ( this.outputSize - this.inputSize ) * 0.5;

		var highestWeight = 0;

		for ( var i = 0; i < this.inputSize; i++ ) {

			for ( var j = 0; j < this.hiddenSize; j++ ) {

				var w = Math.abs(this.inputLayer[i].weights[j]);
				if ( w > highestWeight ) {
					highestWeight = w;
				}
			}
		}
		for ( var i = 0; i < this.hiddenSize; i++ ) {

			for ( var j = 0; j < this.outputSize; j++ ) {

				var w = Math.abs(this.hiddenLayer[i].weights[j]);
				if ( w > highestWeight ) {
					highestWeight = w;
				}
			}
		}


		for ( var i = 0; i < this.inputSize; i++ ) {

			var p0 = new p(x, y + 16 * i);

			for ( var j = 0; j < this.hiddenSize; j++ ) {

				var p1 = new p(x+spaceX,y+16*(j-rh));

				var weight = this.inputLayer[i].weights[j];
				var color = weight;

				if (Math.abs(color) >= highestWeight * 0.9 ) {
					color = 1;
				}
				else {
					color = Math.abs(color) / highestWeight;
				}

				if ( Math.abs(weight) > highestWeight * 0.4 ){

					if ( weight > 0 )
						stroke(255*color,0,0);
					else
						stroke(0,255*color,0);

					line(p0.x,p0.y,p1.x,p1.y);
				}
			}
		}

		for ( var i = 0; i < this.hiddenSize; i++ ) {

			var p0 = new p(x+spaceX,y+16*(i-rh));

			for ( var j = 0; j < this.outputSize; j++ ) {

				var p1 = new p(x+spaceX*2, y + 16 * (j-ro));


				var weight = this.hiddenLayer[i].weights[j];
				var color = weight;

				if (Math.abs(color) >= highestWeight * 0.9 ) {
					color = 1;
				}
				else {
					color = Math.abs(color) / highestWeight;
				}

				if ( Math.abs(weight) > highestWeight * 0.4 ){

					if ( weight > 0 )
						stroke(255*color,0,0);
					else
						stroke(0,255*color,0);

					line(p0.x,p0.y,p1.x,p1.y);
				}
			}
		}

		lineWidth(1);

		stroke(255,255,255);

		for ( var i = 0; i < this.inputSize; i++ ) {

			var v = this.inputLayer[i].value;

			var inv = 1-v;

			fill(255 * inv, 255 * v, 0);

			ellipse(x, y + 16 * i, 4);
		}

		for ( var i = 0; i < this.hiddenSize; i++ ) {

			var v = this.hiddenLayer[i].value;

			var f = sigmoid(v);
			var inv = 1 - f;

			fill(255 * inv, 255 * v, 0);


			ellipse(x+spaceX,y+16*(i-rh), 4);
		}

		for ( var i = 0; i < this.outputSize; i++ ) {

			var v = this.outputLayer[i].value;

			var f = sigmoid(v);
			var inv = 1 - f;

			fill(255 * inv, 255 * v, 0);


			ellipse(x+spaceX*2, y + 16 * (i-ro), 4);
		}


		fill(100,255,100);
		text(x + spaceX, y - 50, "THE BRAIN");
	};

	this.init();
};