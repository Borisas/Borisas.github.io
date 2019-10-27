
function p2(x,y) {
    this.x = x;
    this.y = y;
    this.d = 0;

    this.set2 = function(op) {
        this.x = op.x;
        this.y = op.y;
    }

    this.sub2 = function(op) {
        this.x -= op.x;
        this.y -= op.y;
    }



    this.mag = function() {
        return Math.sqrt(this.x * this.x + this.y*this.y);
    }
}

p2.cross = function(v1,v2) {
    return v1.x*v2.y - v1.y*v2.x;
}

function p4(x,y,z,w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.pixel = function() {

        return new p2(
            Math.round((this.x)/(this.w) * __width + __width/2),
            Math.round((this.y)/(this.w) * __height + __height/2)
        );
    }
}

p4.m4 = function(m4) {
    return new p4(m4[0],m4[1],m4[2],m4[3]);
}
p4.lerp = function(a,b,t) {

    t = t > 1 ? 1 : t;
    t = t < 0 ? 0 : t;

    var x = a.x + (b.x-a.x) * t;
    var y = a.y + (b.y-a.y) * t;
    var z = a.z + (b.z-a.z) * t;
    var w = a.w + (b.w-a.w) * t;
    
    return new p4(x,y,z,w);
}

var p3 = function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.m3 = function() {
        return [this.x,this.y,this.z];
    }
    this.m4 = function(w) {
        return [this.x,this.y,this.z,w];
    }

    this.gcross = function(v) {
        
        var r = new p3();
        r.x = this.x;
        r.y = this.y;
        r.z = this.z;

        r.x = this.y * v.z - this.z * v.y;
        r.y = this.z * v.x - this.x * v.z;
        r.z = this.x * v.y - this.y * v.x;

        return r;
    }

    this.set3 = function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    this.add3 = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    this.sub3 = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    this.mul3 = function(v) {
        this.x = this.x * v.x + this.x * v.y + this.x * v.z;
        this.y = this.y * v.x + this.y * v.y + this.y * v.z;
        this.z = this.z * v.x + this.z * v.y + this.z * v.z;
    }

    this.div = function(v) {
        this.x /= v;
        this.y /= v;
        this.z /= v;
    }

    this.mag = function() {
        return Math.sqrt(x*x + y*y + z*z);
    }

    this.norm = function() {
        var m = this.mag();
        if ( m > 0 ) {
            this.div(m);
        }
    }
}

p3.m3 = function(m3) {
    return new p3(m3[0],m3[1],m3[2]);
}

function d2r(degrees) {
    return degrees * 0.0174533;
}

function mul(a,b){


    if ( a.length == 3 && b.length == 3 ) {
        if ( Array.isArray(b[0]) && Array.isArray(a[0]) ) {

            if ( a[0].length == 3 && b[0].length == 3 ) {
                return mul_3x3_by_3x3(a,b);
            }
        }
        else if (Array.isArray(a[0]) ){
            
            return mul_3x3_by_3(a,b);
        }
        else {
            return mul_3_by_3x3(a,b);
        }
    }
    else if ( a.length == 4 && b.length == 4 ) {

        if ( Array.isArray(b[0]) && Array.isArray(a[0]) ) {
            if ( a[0].length == 4 && b[0].length == 4 ) {
                return mul_4x4_by_4x4(a,b);
            }
        }
        else if ( Array.isArray(a[0])) {
            return mul_4x4_by_4(a,b);
        }
        else {
            return mul_4_by_4x4(a,b,);
        }
    }

    throw "incorrect usage of mul : " + a.length + " != " + b.length;
}

function mrow(a,i) {
    return a[i];
}
function mcol(a,i){
    var r = [];
    for ( let k = 0; k < a.length;k++ ) {
        r.push(a[k][i]);
    }
    return r;
}

function dot(a,b) {
    let sum = 0;
    for ( let k = 0; k < a.length; k++ ) {
        sum += a[k] * b[k];
    }
    return sum;
}




function mul_3x3_by_3x3(a,b) {
    let v0 = dot(mrow(a,0),mcol(b,0));
    let v1 = dot(mrow(a,0),mcol(b,1));
    let v2 = dot(mrow(a,0),mcol(b,2));
    let v3 = dot(mrow(a,1),mcol(b,0));
    let v4 = dot(mrow(a,1),mcol(b,1));
    let v5 = dot(mrow(a,1),mcol(b,2));
    let v6 = dot(mrow(a,2),mcol(b,0));
    let v7 = dot(mrow(a,2),mcol(b,1));
    let v8 = dot(mrow(a,2),mcol(b,2));
    
    return [
        [v0,v1,v2],
        [v3,v4,v5],
        [v6,v7,v8]
    ];
}

function mul_4x4_by_4x4(a,b) {

    let v0 = dot(mrow(a,0),mcol(b,0));
    let v1 = dot(mrow(a,0),mcol(b,1));
    let v2 = dot(mrow(a,0),mcol(b,2));
    let v3 = dot(mrow(a,0),mcol(b,3));

    let v4 = dot(mrow(a,1),mcol(b,0));
    let v5 = dot(mrow(a,1),mcol(b,1));
    let v6 = dot(mrow(a,1),mcol(b,2));
    let v7 = dot(mrow(a,1),mcol(b,3));

    let v8 = dot(mrow(a,2),mcol(b,0));
    let v9 = dot(mrow(a,2),mcol(b,1));
    let v10 = dot(mrow(a,2),mcol(b,2));
    let v11 = dot(mrow(a,2),mcol(b,3));

    let v12 = dot(mrow(a,3),mcol(b,0));
    let v13 = dot(mrow(a,3),mcol(b,1));
    let v14 = dot(mrow(a,3),mcol(b,2));
    let v15 = dot(mrow(a,3),mcol(b,3));
    
    
    return [
        [v0,v1,v2,v3],
        [v4,v5,v6,v7],
        [v8,v9,v10,v11],
        [v12,v13,v14,v15]
    ];
}

function mul_4_by_4x4(a,b){
    return [
        dot(a,mcol(b,0)),
        dot(a,mcol(b,1)),
        dot(a,mcol(b,2)),
        dot(a,mcol(b,3))
    ]
}

function mul_4x4_by_4(a,b){
    return [ 
        dot(mrow(a,0),b),
        dot(mrow(a,1),b),
        dot(mrow(a,2),b),
        dot(mrow(a,3),b)
    ]
}

function mul_3x3_by_3(a,b){
    
    return [ 
        dot(mrow(a,0),b),
        dot(mrow(a,1),b),
        dot(mrow(a,2),b)
    ]
}

function mul_3_by_3x3(a,b){
    return [
        dot(a,mcol(b,0)),
        dot(a,mcol(b,1)),
        dot(a,mcol(b,2))
    ]
}
