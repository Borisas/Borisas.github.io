
var evolution = function() {

	this.population = 50;
	this.generation = 0;

	this.actors = [];
	this.games = [];

	this.fittestMember = null;
	this.fittestMemberGame = null;

	this.previousFitness = 0;

	this.simulationDone = false;

	this.mutation = 0.1;

	this.mutationMin = 0.1;
	this.mutationMax = 3.0;

	this.init = function () {

		var firstParent = new ai();
		
		this.newGeneration(firstParent);
	}

	this.newGeneration = function(parent) {

		this.generation++;

		if ( this.fittestMemberGame != null && this.fittestMember != null ) {
			var newfitness = this.fittestMemberGame.getFitness();

			if ( newfitness <= this.previousFitness ) {

				this.mutation += 0.1;
			}
			else {
				this.mutation -= 0.1;
			}

			this.previousFitness = newfitness;

			if ( this.mutation > this.mutationMax ) this.mutation = this.mutationMax;
			if ( this.mutation < this.mutationMin ) this.mutation = this.mutationMin;
		}

		console.log("---");
		console.log("MUTATION: " + this.mutation);
		console.log("FITNESS:" + this.previousFitness);
		if ( this.fittestMember ) {
			console.log(this.fittestMember.decisions);
		}
		console.log("---");

		this.games = [];

		var newActors = [];

		newActors.push(parent);

		var g = new game();
		g.player = parent;
		this.games.push(g);

		parent.resetDecision();
		parent.resetRecords();

		for ( var i = 1; i < this.population; i++ ) {

			var c = new ai();
			c.inherit(parent, this.mutation);

			newActors.push(c);


			var g = new game();
			g.player = c;
			this.games.push(g);
		}

		this.actors = newActors;
	}

	this.run = function() {

		if ( !this.simulationDone ) {
			this.runSimulation();
		}
		else {
			this.playSimulation();
		}

		this.drawUI();

	}

	this.drawUI = function() {


		fill(255,255,150);
		text(640, 160, "GENERATION:");
		text(640,190, this.generation.toString());

	}

	this.runSimulation = function() {


		var playing = 0;

		do {

			playing = 0;

			for ( var i = 0; i < this.games.length; i++ ) {

				if ( this.games[i].over ) continue;

				this.games[i].playAI();

				playing++;
			}

		} while(playing > 0);

		var highestFitness = 0;
		var p = null;

		for ( var i = 0; i < this.games.length; i++ ) {

			if ( p == null || highestFitness < this.games[i].getFitness() ) {
				p = this.games[i];
				highestFitness = this.games[i].getFitness();
			}
		}

		this.fittestMember = p.player;
		this.fittestMemberGame = p;

		this.simulationDone = true;
		this.fittestMemberGame.prepareSimulation();
	}

	this.nextGeneration = function() {

		this.newGeneration(this.fittestMember);
		this.simulationDone = false;
	}

	this.playSimulation = function() {

		this.fittestMemberGame.replayAI();

		if ( this.fittestMemberGame.over == true ) {

			this.nextGeneration();
			this.simulationDone = false;
		}
				
	};


	this.init();
};