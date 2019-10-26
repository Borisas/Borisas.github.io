var obj3d = function() {

    var position = new p3(0,0,0);
    var rotation = new p3(0,0,0);
    var scale = new p3(1,1,1);

    var identity = null;
    var dirty = true;

    this.vertices = [];
    this.triangles = [];
    
    this.animation = null;

    this.test = function() {
        // position.x += 1;
        if ( this.animation != null ) {
            this.animation(position,rotation,scale,millis());
        }
        rotation.x %= 360;
        rotation.y %= 360;
        rotation.z %= 360;

        dirty= true;
    }

    this.setupCube = function() {

        
        this.vertices = [
            new p3(-0.5,-0.5,0.5),  //a //0
            new p3(0.5,-0.5,0.5),   //b //1
            new p3(0.5,-0.5,-0.5),  //c //2
            new p3(-0.5,-0.5,-0.5), //d //3
            new p3(-0.5,0.5,0.5),   //e //4
            new p3(0.5,0.5,0.5),    //f //5
            new p3(0.5,0.5,-0.5),   //g //6
            new p3(-0.5,0.5,-0.5)   //h //7
        ];

        this.triangles = [
            [0,2,1],    //ACB
            [2,3,0],    //DCA
            [0,4,5],    //AEF
            [0,1,5],    //ABF
            [1,5,6],    //BFG
            [1,2,6],    //BCG
            [3,7,6],    //DHG
            [2,3,6],    //CDG
            [4,6,7],    //EGH
            [5,4,6],     //FEG
            [0,3,7],
            [0,7,4]
        ]
    }

    this.getIdentity = function() {

        if ( dirty || identity == null ) {


            var rx = d2r(rotation.x);
            var ry = d2r(rotation.y);
            var rz = d2r(rotation.z);

            var rotateX = [
                [1,0,0,0],
                [0,Math.cos(rx),-Math.sin(rx),0],
                [0,Math.sin(rx), Math.cos(rx),0],
                [0,0,0,1]
            ];

            var rotateY = [
                [Math.cos(ry),0,Math.sin(ry),0],
                [0,1,0,0],
                [-Math.sin(ry),0,Math.cos(ry),0],
                [0,0,0,1]
            ]

            var rotateZ = [
                [Math.cos(rz),-Math.sin(rz),0,0],
                [Math.sin(rz),Math.cos(rz),0,0],
                [0,0,1,0],
                [0,0,0,1]
            ]

            var translate = [
                [1,0,0,position.x],
                [0,1,0,position.y],
                [0,0,1,position.z],
                [0,0,0,1]
            ];

            var scaleM = [
                [scale.x,0,0,0],
                [0,scale.y,0,0],
                [0,0,scale.z,0],
                [0,0,0,1]
            ]
            
            // identity = mul(translate,scaleM);

            identity = mul(translate,scaleM);
            identity = mul(identity,rotateX);
            identity = mul(identity,rotateY);
            identity = mul(identity,rotateZ);
            
            dirty = false;
        }
        return identity;
    }

    this.forEachVertexModel = function(call,view,projection) {

        this.getIdentity();

        let mvp = mul(mul(projection,view),identity);

        for ( let i = 0; i < this.vertices.length; i++ ) {

            var vec = mul(mvp, this.vertices[i].m4(1));
            call(vec,this.vertices[i].m4(1));
        }

    }

    this.forEachTriangle = function(call,view,projection) {

        this.getIdentity();

        let mvp = mul(mul(projection,view),identity);
        // let vp = mul(projection,view);

        // function ctriangle() {

        //     this.points = [];
        //     this.avgz = 0;
        // }

        // var ctriangles = [];

        for ( let i = 0; i < this.triangles.length; i++ ) {

            var t0 = this.triangles[i][0];
            var t1 = this.triangles[i][1];
            var t2 = this.triangles[i][2];
            
            var v0 = this.vertices[t0];
            var v1 = this.vertices[t1];
            var v2 = this.vertices[t2];

            var p0 = mul(mvp, v0.m4(1));
            var p1 = mul(mvp, v1.m4(1));
            var p2 = mul(mvp, v2.m4(1));



            // var vp0 = mul(vp,v0.m4(1));
            // var vp1 = mul(vp,v1.m4(1));
            // var vp2 = mul(vp,v2.m4(1));

            // var trian = new ctriangle();
            // trian.points.push(p0);
            // trian.points.push(p1);
            // trian.points.push(p2);

            // trian.avgz = ( vp0[2] + vp1[2] + vp2[2] ) / 3;

            // ctriangles.push(trian);

            call(p0,p1,p2);
        }

        // ctriangles.sort((a,b)=>{
        //     return a.avgz < b.avgz;
        // });

        // for ( let i = 0; i < ctriangles.length; i++ ) {
        //     call(ctriangles[i].points[0], ctriangles[i].points[1],ctriangles[i].points[2]);
        // }
    }

    ////changes

    this.setPosition = function(p) {
        position = p;
        dirty= true;
    }
    this.getPosition = function() {
        return position;
    }
    
    this.setRotation = function(p) {
        rotation = p;
        dirty= true;
    }
    this.getRotation = function() {
        return rotation;
    }
    
    this.setScale = function(p) {
        scale = p;
        dirty= true;
    }
    this.getScale = function() {
        return scale;
    }
}