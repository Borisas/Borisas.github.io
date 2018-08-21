
var node = function() {

	this.value = 0.0;
	this.weights = [];

};

var ai = function() {

	this.inputLayer = [];
	this.hiddenLayer = [];
	this.outputLayer = [];

	this.inputSize = 6;
	this.hiddenSize = 12;
	this.outputSize = 3;

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
	}

	this.getRecordedDecision = function() {

		if ( this.lastDecision > this.decisions.length ) return -1;

		var d = this.decisions[this.lastDecision];

		this.lastDecision++;

		return d;
	}

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
	this.resetRecords = function() {

		this.decisions = [];
	}


	this.init();
};