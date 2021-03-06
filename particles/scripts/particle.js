
function sqrdist(xa,ya,xb,yb) {
    return (xa-xb)*(xa-xb) + (ya-yb) * (ya - yb);
}

function lerp(a,b,t) {
    return a + (b-a) * t;
}

function setupAtractions( typecount) {

    let atractions = [];
    for ( let i = 0; i < typecount; i++ ) {
        // atractions.push(randomInteger(3,5) * 0.001 * (randomInteger(0,1) == 0 ? 1 : -1));
        atractions.push(randomFloat(0.5,1)  * 100 * (randomInteger(0,1) == 0 ? 1 : -1));
    }
    return atractions;
}

function fixDistForLoopingW(x) {
    if ( Math.abs(x) > sw/2 ) {
        x = sw - Math.abs(x);
    }
    return x;
}

function fixDistForLoopingH(x) {

    if ( Math.abs(x) > sh/2 ) {
        x = sh - Math.abs(x);
    }
    return x;
}


var Particle = function(r,g,b) {
    //private && vars
    
    this.r = r;
    this.g = g;
    this.b = b;

    this.x = 200;
    this.y = 200;
    this.radius = 4;

    this.attractions = [];

    this.interactionDistance = 0;
    this.damping = 0.01;

    this.vx = 0;
    this.vy = 0;

    this.type = 0;

    this.maxSpeed = 100;
}

//public

Particle.prototype.update = function(otherParticles) {

    this.fixPos();

    for ( let i = 0; i < otherParticles.length; i++ ) {

        let op = otherParticles[i];

        if ( op == this ) continue;

        let dist2 = this.d(op);

        if ( dist2 > this.interactionDistance * this.interactionDistance ) continue;
        
        this.interact(op, dist2);
        this.checkCollision(op,dist2);

        // if ( Number.isNaN(this.vx) == false ) {
        //     console.log(this.vx);
        // }
    }




    let len2 = sqrdist(this.vx,this.vy,0,0);
    // this.vx -= Math.sign(this.vx) * len2 * this.damping;
    // this.vy -= Math.sign(this.vy) * len2 * this.damping;
    

    if ( len2 > this.maxSpeed * this.maxSpeed ) {
        let len = Math.sqrt(len2);
        if ( len != 0 ) {
            this.vx = (this.vx/len) * this.maxSpeed;
            this.vy = (this.vy/len) * this.maxSpeed;
        }
    }
    if ( Number.isNaN(this.vx) ) {
        console.log("BREAKING");
        running = false;
    }

    this.x += (DELTA/1000) * this.vx;
    this.y += (DELTA/1000) * this.vy;
}

Particle.prototype.draw = function() {

    fill(this.r,this.g,this.b);
    stroke(255-this.r,255-this.g,255-this.b);
    ellipse(this.x,this.y,this.radius)
}

Particle.prototype.fixPos = function() {

    if ( this.x < 0 ) this.x += sw;
    else if ( this.x > sw ) this.x -= sw;

    if ( this.y < 0 ) this.y += sh;
    else if ( this.y > sh ) this.y -= sh;
}

Particle.prototype.d = function(o){

    let xdiff = this.x - o.x;
    let ydiff = this.y - o.y;

      // this could work, but the way collision is handle breaks it
    xdiff = fixDistForLoopingW(xdiff);
    ydiff = fixDistForLoopingH(ydiff);
    

    return sqrdist(xdiff,ydiff, 0,0);
}

Particle.prototype.interact = function(o, dist2) {

    if ( this.attractions == null || this.attractions.length == 0 ) return;

    let i = o.type;

    if ( this.attractions.length < i ) return;


    
    let dirX = this.x - o.x;
    let dirY = this.y - o.y;
    dirX = fixDistForLoopingW(dirX);
    dirY = fixDistForLoopingH(dirY);

    // i know it's not linear

    let len2 = sqrdist(dirX,dirY,0,0);
    if ( len2 == 0 ) return;
    let len = Math.sqrt(len2);
    if ( len == 0 ) return;


    let av = this.attractions[i];

    let asX = av * (dirX/len);
    let asY = av * (dirY/len);

    // if ( Number.isNaN(this.vx) == false ) {
    //     console.log("asX = " + asX + " this.x = " + this.x + " ox = " + o.x + " av = " + av + " len = " + len);
    // }

    this.vx += asX * (DELTA/1000);
    this.vy += asY * (DELTA/1000);
}

Particle.prototype.checkCollision = function(o,dist2) {

    if ( dist2 > 4 * this.radius * this.radius ) return;

    let dist = Math.sqrt(dist2);

    if ( dist == 0 ) return;

    let dx = this.x - o.x;
    let dy = this.y - o.y;
    
    dx = fixDistForLoopingW(dx);
    dy = fixDistForLoopingH(dy);

    let ndx = dx / dist;
    let ndy = dy / dist;

    let ddiff = this.radius*2 - dist;;
    let halfddiff = ddiff / 2;

    this.x += ndx * halfddiff;
    this.y += ndy * halfddiff;

    o.x += -ndx * halfddiff;
    o.y += -ndy * halfddiff;
    if ( Number.isNaN(this.x) ) {
        console.log("!");
    }
}

//static

Particle.create = function() {

    let id = randomInteger(0,4);

    switch(id) {
        case 0: return Particle.createA();
        case 1: return Particle.createB();
        case 2: return Particle.createC();
        case 3: return Particle.createD();
        case 4: return Particle.createE();
        default: return Particle.create();
    }
}

Particle.attractionsA = null;
Particle.createA = function() {
    var p = new Particle(255,0,0);
    p.type = 0;

    if ( Particle.attractionsA === null ) 
        Particle.attractionsA = setupAtractions(5);
    p.attractions = Particle.attractionsA;

    return p;
}

Particle.attractionsB = null;
Particle.createB = function() {
    var p = new Particle(0,255,0);
    p.type = 1;

    if ( Particle.attractionsB === null ) 
        Particle.attractionsB = setupAtractions(5);
    p.attractions = Particle.attractionsB;

    
    return p;
}

Particle.attractionsC = null;
Particle.createC = function() {
    var p = new Particle(0,0,255);
    p.type = 2;

    if ( Particle.attractionsC === null ) 
        Particle.attractionsC = setupAtractions(5);
    p.attractions = Particle.attractionsC;

    
    return p;
}

Particle.attractionsD = null;
Particle.createD = function() {
    var p = new Particle(255,255,255);
    p.type = 3;

    if ( Particle.attractionsD === null ) 
        Particle.attractionsD = setupAtractions(5);
    p.attractions = Particle.attractionsD;

    
    return p;
}

Particle.attractionsE = null;
Particle.createE = function() {
    var p = new Particle(0,0,0);
    p.type = 4;

    if ( Particle.attractionsE === null ) 
        Particle.attractionsE = setupAtractions(5);
    p.attractions = Particle.attractionsE;

    
    return p;
}



//-------------------------------------

