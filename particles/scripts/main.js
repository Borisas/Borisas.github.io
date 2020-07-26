
var particles = [];

var particleCount = 500;

var sw = 768;
var sh = 512;
var particleStep = 15;

var running = true;

function setup() {
	init(sw,sh,true);
    backgroundStyle(55,55,55);

    let screenD = Math.sqrt(Math.pow(sw,2) + Math.pow(sh,2));

    for ( let i = 0; i < particleCount; i++ ) {

        let p = Particle.create();
        p.x = (1+randomInteger(0,sw/particleStep-2))*particleStep;
        p.y = (1+randomInteger(0,sh/particleStep-2))*particleStep;

        p.interactionDistance = screenD * 0.075;

        particles.push(p);
    }
}

function draw() {

    if ( !running ) return;

    clear();

    
    for ( let i = 0; i < particles.length; i++ ) {
        particles[i].update(particles);
        particles[i].draw();
    }
}
