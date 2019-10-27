
var o3d = null;
var cam = null;

var rend= null;

function tp(p) {

    var x = p[0] / p[3];
    var y = p[1] / p[3];

    return {
        x : x * __width + __width * 0.5,
        y : y * __height + __height * 0.5
    }
}


function setup() {


	init(768,512,true);
    backgroundStyle(55,55,55);
    
    o3d = new obj3d();
    o3d.setupCube();

     cam = new camera();
    console.log("MODEL");
    console.log(o3d.getIdentity());
    console.log("VIEW");
    console.log(cam.getView());
    console.log("PROJECTION");
    console.log(cam.getProjection());
    console.log("MVP");
    console.log(mul(mul(cam.getProjection(),cam.getView()),o3d.getIdentity()));
    console.log("=========");

    o3d.forEachVertexModel((p,t)=>{


        var at = tp(p);
        console.log(at);
        console.log(p);
        console.log(t);
        console.log("----");
// 
    },cam.getView(), cam.getProjection());

    initValues();
    ml =  millis() % slowdown;;

    rend = new Renderer();
    rend.attach();
    rend.setCamera(cam);
}
var ml;
var slowdown = 5000;

function draw() {
    // if ( millis() % slowdown < ml ) {
    
        clear();

        rend.extract();

        let i  =0;
        let step = 255 / o3d.getTriangleCount();

        o3d.forEachTriangle((p0,p1,p2)=>{

            
            var p40 = p4.m4(p0);
            var p41 = p4.m4(p1);
            var p42 = p4.m4(p2);

            // rend.drawLine3D(p40,p41);
            // rend.drawLine3D(p41,p42);
            // rend.drawLine3D(p42,p40);

            // if ( i%2 == 0) {
                c = step * i > 255 ? 255 : step * i;
                rend.drawTriangle3D(p40,p41,p42,c,c,c);
            // }

            i++;

        }, cam.getView(), cam.getProjection());

        rend.blit();

        // let a = 0;
        // stroke(255,255,0);

        // stroke(255,255,255);
        // let k = 0;
        // textSize(24);
        // o3d.forEachVertexModel((p)=>{
            
        //     var at = tp(p);
        //     rect(at.x-2,at.y-2,4,4);
        //     k++;
        // },cam.getView(), cam.getProjection());

        // stroke(255,255,0);

        o3d.test();
        
        initValues();
    // }
    // ml = millis() % slowdown;
}

function initValues() {

    function set(n,v){
        var o = document.getElementsByName(n)[0];
        if ( o == null || o == undefined ) return;
        o.value = v;
    }

    var tp = o3d.getPosition();
    var tr = o3d.getRotation();
    var ts = o3d.getScale();

    set("tpx",tp.x); set("tpy",tp.y); set("tpz",tp.z);

    set("trx",tr.x); set("try", tr.y); set("trz",tr.z);

    set("tsx", ts.x); set("tsy",ts.y); set("tsz",ts.z);

    var cp = cam.getPosition();
    var cu = cam.getUp();

    set("cpx",cp.x); set("cpy",cp.y); set("cpz",cp.z);
    set("cux",cu.x); set("cuy",cu.y); set("cuz",cu.z);
    
    var fovy = cam.getFovY();
    var near = cam.getNear();
    var far = cam.getFar();

    set("fovy", fovy);
    set("near",near);
    set("far",far);
}

function onvalue(caller){

    var n = caller.name;
    function is(val) {
        return n == val;
    }
    var v = caller.value;

    if ( is("tpx") ) {
        var p = o3d.getPosition();
        p.x = Number(v);
        o3d.setPosition(p);
    }
    else if ( is("tpy") ) {
        var p = o3d.getPosition();
        p.y = Number(v);
        o3d.setPosition(p);
    }
    else if ( is("tpz") ) {
        var p = o3d.getPosition();
        p.z = Number(v);
        o3d.setPosition(p);
    }
    else if ( is("trx") ) {
        var p = o3d.getRotation();
        p.x = Number(v);
        o3d.setRotation(p);
    }
    else if ( is("try") ) {
        var p = o3d.getRotation();
        p.y = Number(v);
        o3d.setRotation(p);
    }
    else if ( is("trz") ) {
        var p = o3d.getRotation();
        p.z = Number(v);
        o3d.setRotation(p);
    }
    else if ( is("tsx") ) {
        var p = o3d.getScale();
        p.x = Number(v);
        o3d.setScale(p);
    }
    else if ( is("tsy") ) {
        var p = o3d.getScale();
        p.y = Number(v);
        o3d.setScale(p);
    }
    else if ( is("tsz") ) {
        var p = o3d.getScale();
        p.z = Number(v);
        o3d.setScale(p);
    }
    else if ( is("cpx") ) {
        var p = cam.getPosition();
        p.x = Number(v);
        cam.setPosition(p);
    }
    else if ( is("cpy") ) {
        var p = cam.getPosition();
        p.y = Number(v);
        cam.setPosition(p);
    }
    else if ( is("cpz") ) {
        var p = cam.getPosition();
        p.z = Number(v);
        cam.setPosition(p);
    }
    else if ( is("ctx") ) {
        var p = cam.getTarget();
        p.x = Number(v);
        cam.setTarget(p);
    }
    else if ( is("cty") ) {
        var p = cam.getTarget();
        p.y = Number(v);
        cam.setTarget(p);
    }
    else if ( is("ctz") ) {
        var p = cam.getTarget();
        p.z = Number(v);
        cam.setTarget(p);
    }
    else if ( is("cux") ) {
        var p = cam.getUp();
        p.x = Number(v);
        cam.setUp(p);
    }
    else if ( is("cuy") ) {
        var p = cam.getUp();
        p.y = Number(v);
        cam.setUp(p);
    }
    else if ( is("cuz") ) {
        var p = cam.getUp();
        p.z = Number(v);
        cam.setUp(p);
    }
    else if ( is("fovx") ) {
        cam.setFovX(Number(v));
    }
    else if ( is("fovy") ) {
        cam.setFovY(Number(v));
    }
    else if ( is("near") ) {

        cam.setNear(Number(v));
    }
    else if ( is("far") ) {

        cam.setFar(Number(v));
    }
    else {
        throw "NOT HANDLED";
    }
}

function update_animation() {

    var animf = document.getElementById('animfunction');
    var f = animf.value;
    console.log(f);
    f = "(function s(position,rotation,scale,time){"+f+"})(arguments[0],arguments[1],arguments[2],arguments[3]);";

    try { 
        
        var  animation = new Function(f);
        
        var a = new p3(0,0,0);
        var b = new p3(0,0,0);
        var c = new p3(0,0,0);
        animation(a,b,c);
        o3d.animation = animation;
    }
    catch {}

}


function objdrop(ev) {
    
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
      
    var file = ev.dataTransfer.items[0].getAsFile();

    if ( file.name.includes(".obj") ) {

        console.log(file);
        
        let reader = new FileReader();
        reader.onload = function (event) {
            //holder.style.background = 'url(' + event.target.result + ') no-repeat center';
            console.log("ON LOAD");
            console.log(event);
            let file = event.target.result;

            var lines = file.split('\n');
            
            try {
                function getTriangle(t) {
                    if ( t.includes("/") ) {
                        return Number(t.split("/")[0]);
                    }
                    return Number(t);
                }
                o3d.reset();
                for ( let i = 0 ;i < lines.length; i++ ) {

                    var l = lines[i];
                    var split = l.split(" ");

                    if ( split[0] === "v") {
                        var vert = new p3(Number(split[1]),Number(split[2]),Number(split[3]));
                        o3d.addVertex(vert);
                    }
                    else if ( split[0] === "f" ) {

                        var trianglePoints = [];
                        let contains0 = false;
                        for ( let k = 1; k < split.length; k++ ) {
                            trianglePoints.push(getTriangle(split[k]));
                            if ( trianglePoints[trianglePoints.length-1] === 0 ) contains0 = true;
                        }
                        // console.log(trianglePoints);

                        let rem = contains0 ? 0 : 1;
                        for ( let k = 1; k <= trianglePoints.length-2; k++ ) {
                            // o3d.addTriangle()

                            let t0 = trianglePoints[0]-rem;
                            let t1 = trianglePoints[k]-rem;
                            let t2 = trianglePoints[k+1]-rem;

                            o3d.addTriangle(t0,t1,t2);
                        }
                    }
                }
            }
            catch {
                o3d.setupCube();
                console.log("failed to read file");
            }
        };
        reader.onprogress = function(event) {
            console.log(event);
        }
        reader.readAsText(file);
    }
    else {
        console.log("Can't read file");
    }
  }
}

var g = null;

function objdragover(ev) {
    return ev.preventDefault();
}
