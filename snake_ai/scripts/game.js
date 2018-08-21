
var p = function(x,y) {

	this.x = typeof(x) == "undefined" ? 0 : x;
	this.y = typeof(y) == "undefined" ? 0 : y;

	this.clone = function() {

		return new p(this.x,this.y);
	};

	this.equals = function(o) {

		return this.x == o.x && this.y == o.y;
	}
};

var dir = { up : 0, right : 1, down : 2, left : 3 };

var game = function() {

	this.snake = [];
	this.direction = 0;
	this.grow = false;

	this.food = null;
	this.foodPositions = [];
	this.lastFood = 0;

	this.interval = 50;
	this.timer = 0;

	this.score = 0;

	this.humanInput = 0;

	this.player = null;
	this.bad = false;
	this.movesSinceFood = 0;
	this.over = false;


	this.init = function() {

		{
			this.food = new p();
			this.food.x = 12;
			this.food.y = 9;
		}

		{
			var ss = new p();
			ss.x = 4;
			ss.y = 8;

			this.snake.push(ss);
		}

		this.direction = 0;
	};

	this.restart = function() {
		this.food = null;
		this.snake = [];
		this.score = 0;
		this.grow = false;
		this.direction = 0;
		this.timer = 0;

		this.init();
	};

	this.prepareSimulation = function() {

		this.snake = [];
		this.food = null;
		this.score = 0;
		this.grow = false;
		this.direction = 0;
		this.timer = 0;
		this.over = false;

		this.init();
	}
	

	this.play = function() {

		this.timer += DELTA;
		this.spawner();

		if ( this.timer >= this.interval ) {
			this.handleInput(this.humanInput);
			this.humanInput = 0;
			this.moveSnake();
			this.checkCollision();

			this.timer -= this.interval;
		}

		this.draw();
		this.drawUI();
	};

	this.playAI = function() {

		if ( this.over ) return;

		this.spawner(true);

		{
			//GET DATA FOR DECISION
			var spaceForward = this.getSpace(0);
			var spaceRight = this.getSpace(1);
			var spaceLeft = this.getSpace(3);

			var distToFoodForward = this.getDistToFood(0);
			var distToFoodRight = this.getDistToFood(1);
			var distToFoodLeft = this.getDistToFood(3);

			this.player.makeDecision([
				spaceForward,
				spaceRight,
				spaceLeft,
				distToFoodForward,
				distToFoodRight,
				distToFoodLeft
			]);
		}
		this.player.recordDecision();
		this.handleInput(this.player.getDecision());
		this.player.resetDecision();
		this.moveSnake();
		this.checkCollision();

		this.movesSinceFood++;
		if ( this.movesSinceFood > 200 ) {

			// if ( this.score <= 1 ) 
			this.bad = true;
			this.over = true;
		}
	};

	this.isSpaceVisitable = function(x,y) {

		if ( x < 0 || x >= 16 || y < 0 || y >= 16 ) return false;

		var pos = new p(x,y);

		for ( var i = 1; i < this.snake.length; i++ ) {

			if ( this.snake[i].equals(pos) ) return false;
		}

		return true;
	};

	this.getRelativeDirection = function(to){

		var newdir = this.direction + to;

		if ( newdir > 3 ) newdir -= 4;
		if ( newdir < 0 ) newdir += 3;

		return newdir;
	};

	this.getSpace = function(dir) {

		var actual = this.getRelativeDirection(dir);

		var movVec = new p();

		if 		( actual == 0 ) movVec.y = -1;
		else if ( actual == 1 ) movVec.x = +1;
		else if ( actual == 2 ) movVec.y = +1;
		else if ( actual == 3 ) movVec.x = -1;

		var cp = this.snake[0].clone();

		var space = 0;

		for ( var i = 0; i < 16; i++ ) {

			cp.x += movVec.x;
			cp.y += movVec.y;

			if ( this.isSpaceVisitable(cp.x,cp.y) ) {
				space++;
				continue;
			}

			break;
		}

		return space / 16;
	};

	this.getDistToFood = function(dir) {

		var actual = this.getRelativeDirection(dir);

		if ( this.food == null ) return 1;

		var sh = this.snake[0];

		var dx = this.food.x - sh.x;
		var dy = this.food.y - sh.y;

		var ret = 1;

		if ( actual == 0 ) {
			//y; negative
			ret = dy > 0 ? 1 : Math.abs(dy) / 16;
		}
		else if ( actual == 1 ) {
			//x; positive
			ret = dx < 0 ? 1 : Math.abs(dx) / 16;
		}
		else if ( actual == 2 ) {
			//y; positive
			ret = dy < 0 ? 1 : Math.abs(dy) / 16;
		}
		else if ( actual == 3 ) {
			//x; negative
			ret = dx > 0 ? 1 : Math.abs(dx) / 16;
		}

		return ret;
	};

	this.replayAI = function() {

		if ( this.over ) return;

		this.timer += DELTA;
		this.spawnerReplay();

		if ( this.timer >= this.interval ) {

			var d = this.player.getRecordedDecision();
			if ( d == -1 ) {
				this.over = true; 
				return; 
			}

			this.handleInput(d);
			this.moveSnake();
			this.checkCollision();

			this.timer -= this.interval;
		}

		this.draw();
		this.drawUI();
	};

	this.moveSnake = function() {

		if ( this.snake.length == 0 ) return;

		var last = this.snake[0].clone();
		var current = this.snake[0];

		if 		( this.direction == 0 ) current.y -= 1;
		else if ( this.direction == 1 ) current.x += 1;
		else if ( this.direction == 2 ) current.y += 1;
		else if ( this.direction == 3 ) current.x -= 1;

		if ( this.snake.length > 1 ) {

			for ( var i = 1; i < this.snake.length; i++ ) {

				var t = this.snake[i].clone();
				this.snake[i].x = last.x;
				this.snake[i].y = last.y;
				last = t;
			}
		}

		if ( this.grow ) {

			this.snake.push(last);
			this.grow = false;
		}
	};

	this.checkCollision = function() {

		if ( this.snake.length <= 0 ) return;

		var sh = this.snake[0];

		{//food
			if ( this.food != null ) {
				if ( sh.equals(this.food) ) {
					this.grow = true;
					this.food = null;
					this.score += 1;
					this.movesSinceFood = 0;
				}
			}

		}
		{//self
			for ( var i = 1; i < this.snake.length; i++ ) {

				if ( this.snake[i].equals(sh) ) {
					this.onDeath();
					break;
				}
			}
		}
		{//walls

			var dead = false;

			if ( sh.x < 0 ) {
				sh.x = 0;
				dead = true;
			}
			else if ( sh.x >= 16 ) {
				sh.x = 15;
				dead = true;
			}

			if ( sh.y < 0 ) {
				sh.y = 0;
				dead = true;
			}
			else if ( sh.y >= 16 ) {
				sh.y = 15;
				dead = true;
			}

			if ( dead ) {
				this.onDeath();
			}
		}

	};


	this.spawner = function(record) {

		record = typeof(record) == "undefined" ? false : record;;

		if ( this.food == null ) {

			
			var availablePositions = [];

			for ( var i = 0; i < 16; i++ ) {

				for ( var j = 0; j < 16; j++ ) {

					var pos = new p(i,j);
					var exists = false;

					for ( var k = 0; k < this.snake.length; k++ ) {

						if ( this.snake[k].equals(pos) ) {
							exists = true;
							break;
						}
					}

					if ( exists ) continue;

					availablePositions.push(new p(i,j));
				}
			}

			if ( availablePositions.length == 0 ) {

				this.onWin();
			}
			else {
				var foodpos = randomElement(availablePositions);
				if ( record ) {
					this.foodPositions.push(foodpos);
				}
				this.food = foodpos;
			}
		}
	};

	this.spawnerReplay = function() {

		if ( this.food == null ) {

			var p = this.foodPositions[this.lastFood];
			
			if ( this.foodPositions.length <= this.lastFood ) {
				// this.spawner();
				this.over = true;
				return;
			} else {


				this.food = p;

				this.lastFood++;
			}
		}
	};

	this.draw = function() {

		stroke(255,255,255);
		fill(0,0,0);
		for ( var i = 0; i < 16; i++ ) {
			for ( var j = 0; j < 16; j++ ) {
				rect(i*32,j*32,32,32);
			}
		}

		if ( this.food !== null ) {
			fill(180,255,0);
			rect(this.food.x * 32, this.food.y * 32, 32, 32);
		}

		if ( this.snake.length > 0 ) {

			fill(0,180,255);
			
			for ( var i = 0; i < this.snake.length; i++ ) {

				var x = this.snake[i].x;
				var y = this.snake[i].y;

				rect(x*32,y*32,32,32);
			}
		}
	};

	this.drawUI = function() {

		fill(255,150,150);
		text(640, 80, "SCORE:");
		text(640,120, this.score.toString());

	}

	this.catchInput = function() {

		if ( KEY_DOWN == "KeyA" ) 
			this.humanInput = 1;
		else if ( KEY_DOWN == "KeyD" ) 
			this.humanInput = 2;
	};

	this.handleInput = function(inp) {

		if ( inp == 0 ) return;
		else if ( inp == 1 ) this.direction--;
		else if ( inp == 2 ) this.direction++;

		if ( this.direction < 0 ) this.direction = 3;
		else if ( this.direction > 3 ) this.direction = 0;
	};

	this.onDeath = function() {
		
		if ( this.player == null ) {
			this.restart();
			return;
		}

		this.over = true;
	};

	this.onWin = function() {

		console.log("WHAT HOW.");
		this.over = true;
	};


	this.getFitness = function() {

		if ( this.bad ) return 0;

		if ( this.food == null ) return this.score;

		var dx = this.food.x - this.snake[0].x;
		var dy = this.food.y - this.snake[0].y;

		var distScore = ((1-(dx/16)) + (1-(dy/16))) * 0.25;

		return this.score + distScore;
	};

	this.init();
};