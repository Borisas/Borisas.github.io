
var camera = function() {
    
    var position = new p3(0,0,-5);
    var target = new p3(0,0,0);
    var up = new p3(0,1,0);
    var right = new p3(1,0,0);
    var forward = new p3(0,0,1);

    var fovX = 90;
    var fovY = 90;
    var aspect = 16/9;
    var near = 0.1;
    var far = 100;

    this.getView = function() {

        var x = new p3(0,0,0);
        x.set3(up);
        
        var r = new p3(1,0,0);
        r.mul3(up);
        r.norm();

        var f = new p3(0,0,1);
        f.mul3(up);
        f.norm();

        var q = new p3(0,0,0);
        q.x = -dot(r.m3(), position.m3());
        q.y = -dot(up.m3(), position.m3());
        q.z = dot(f.m3(), position.m3());

        return[
            [r.x,r.y,r.z,q.x],
            [up.x,up.y,up.z,q.y],
            [-f.x,-f.y,-f.z,q.z],
            [0,0,0,1]
        ]


        //---
        // var z = new p3(0,0,0);
        // var x = new p3(0,0,0);
        // var y = new p3(0,0,0);

        // z.set3(position);
        // z.sub3(target);
        // z.norm();

        // x.set3(up);
        // x = x.gcross(z);
        // x.norm();

        // y = z.gcross(x);
        // y.norm();

        // return [
        //     [x.x,y.x,z.x,0],
        //     [x.y,y.y,z.y,0],
        //     [x.z,y.z,z.z,0],
        //     [-dot(x.m3(),position.m3()), -dot(y.m3(), target.m3()), -dot(z.m3(),target.m3()),1]
        // ];

        //----------
        // var q = new p3(0,0,0);

        // q.x = -dot(right.m3(),position.m3());
        // q.y = -dot(up.m3(),position.m3());
        // q.z = -dot(forward.m3(),position.m3());

        // var ma = [
        //     [1,0,0,0],
        //     [0,1,0,0],
        //     [0,0,-1,0],
        //     [q.x,q.y,q.z,1]
        // ];

        // return ma;
        //------------
        // var x = new p3(0,0,0);
        // var y = new p3(0,0,0);
        // var z = new p3(0,0,0);

        // z.set3(position);
        // z.sub3(target);
        // z.norm();

        // y.set3(up);

        // x = y.gcross(z);

        // y = z.gcross(x);

        // x.norm();
        // y.norm();

        // let v0 = x.x;
        // let v1 = x.y;
        // let v2 = x.z;
        // let v3 = -dot(x.m3(),position.m3());
    
        // let v4 = y.x;
        // let v5 = y.y;
        // let v6 = y.z;
        // let v7 = -dot(y.m3(), position.m3());

        // let v8 = z.x;
        // let v9 = z.y;
        // let v10 = z.z;
        // let v11 = -dot(z.m3(), position.m3());

        // let v12 = 0;
        // let v13 = 0;
        // let v14 = 0;
        // let v15 = 1;

        // return [
        //     [v0,v4,v8,v12],
        //     [v1,v5,v9,v13],
        //     [v2,v6,v10,v14],
        //     [v3,v7,v11,v15]
        // ]

        // return [
        //     [v0,v1,v2,v3],
        //     [v4,v5,v6,v7],
        //     [v8,v9,v10,v11],
        //     [v12,v13,v14,v15]
        // ];

    }

    this.getProjection = function() {

        
	// this.projection = new p4(
	// 	rad(30),			//fov
	// 	__width / __height,	//aspect
	// 	0.1,				//near-clip-plane
	// 	100					//far-clip-plane
    // )
    
        var f = d2r(fovY) / 2;
        var aspect = __width / __height;
        var a = (far+near)/(near-far);
        var b = (2*far*near)/(near-far);

        return [
            [f/aspect, 0,0,0],
            [0,f,0,0],
            [0,0,a,b],
            [0,0,-1,0]
        ]

        // var rfx = d2r(fovX);
        // var rfy = d2r(fovX * (__width/__height));

        // var a = Math.atan(rfx/2);
        // var b = Math.atan(rfy/2);
        // var c = -((far+near)/(far-near));
        // var d = -((2*near*far)/(far-near));

        // return [
        //     [a,0,0,0],
        //     [0,b,0,0],
        //     [0,0,c,d],
        //     [0,0,-1,0]
        // ]

    }

    this.calculateRelativeDepth = function(depth) {
        return (far+near)/(far-near) + (1/depth) * ((-2 * far * near) / (far-near));
    }
    ////changes

    this.setPosition = function(p) {
        position = p;
        dirty= true;
    }
    this.getPosition = function() {
        return position;
    }
    
    this.setTarget = function(p) {
        target = p;
        dirty= true;
    }
    this.getTarget = function() {
        return target;
    }
    
    this.setUp = function(p) {
        up = p;
        dirty= true;
    }
    this.getUp = function() {
        return up;
    }

    this.setFovX = function(v) {
        fovX = v;
    }

    this.setFovY = function(v) {
        fovY = v;
    }

    this.setNear = function(v) {
        near = v;
    }

    this.setFar = function(v) {
        far = v;
    }

    this.getFovY = function() {
        return fovY;
    }

    this.getNear = function() {
        return near;
    }

    this.getFar = function() {
        return far;
    }
}