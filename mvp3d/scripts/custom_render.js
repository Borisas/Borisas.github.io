
function pixel (){
    this.x = 0;
    this.y = 0;
    this.lastDepth = -1;
    this.color = {
        r : 0,
        g : 0,
        b : 0
    }
}

function Renderer() {

    var canvas = null;
    var context = null;
    var img = null;
    var depthBuffer = null;
    var camera = null;

    this.setCamera = function(c) {
        camera = c;
    }

    this.attach = function() {
        
        canvas = document.getElementById('main');
        context = canvas.getContext('2d');
    }
    
    this.extract = function() {

        img = context.getImageData(0, 0, canvas.width, canvas.height);
        depthBuffer = new Array(canvas.width * canvas.height);
    }

    this.drawLine3D = function(p0,p1) {

        let pix0 = p0.pixel();
        let pix1 = p1.pixel();

        var d = new p2(0,0);
        d.set2(pix1);
        d.sub2(pix0);
        
        let len = d.mag();

        let steps = Math.round(len);

        for ( let i = 0; i <= steps; i++ ) {

            let prc = i / steps;

            let at = p4.lerp(p0,p1,prc);
            var atpx = at.pixel();

            var depth = getDepth(atpx.x,atpx.y);

            var calcD = camera.calculateRelativeDepth(at.z);

            if ( depth == undefined || depth > calcD ) {
                setPixel(atpx.x,atpx.y,0,255,0);
                setDepth(atpx.x,atpx.y,calcD);
            }
            else {
            }
        }

    }

    this.drawTriangle3D = function(p40,p41,p42, r,g,b) {

        let v1 = p40.pixel();
        v1.d = camera.calculateRelativeDepth(p40.z);
        let v2 = p41.pixel();
        v2.d = camera.calculateRelativeDepth(p41.z);
        let v3 = p42.pixel();
        v3.d = camera.calculateRelativeDepth(p42.z);

        let maxX = Math.max(v1.x, Math.max(v2.x, v3.x));
        let minX = Math.min(v1.x, Math.min(v2.x, v3.x));
        let maxY = Math.max(v1.y, Math.max(v2.y, v3.y));
        let minY = Math.min(v1.y, Math.min(v2.y, v3.y));

        let vs1 = new p2(v2.x - v1.x, v2.y - v1.y);
        let vs2 = new p2(v3.x - v1.x, v3.y - v1.y);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                let q = new p2(x - v1.x, y - v1.y);

                let s = p2.cross(q, vs2) / p2.cross(vs1, vs2);
                let t = p2.cross(vs1, q) / p2.cross(vs1, vs2);

                if ( (s >= 0) && (t >= 0) && (s + t <= 1)) { /* inside triangle */
                    

                    let p = new p2(x,y);
                    let d1 = (new p2(p.x-v1.x,p.y-v1.y)).mag();
                    let d2 = (new p2(p.x-v2.x,p.y-v2.y)).mag();
                    let d3 = (new p2(p.x-v3.x,p.y-v3.y)).mag();

                    let w1 = 1 / d1;
                    let w2 = 1 / d2;
                    let w3 = 1 / d3;

                    // console.log((w1 * v1.d + w2 * v2.d + w3 * v3.d) , (w1+w2+w3));


                    let depth = getDepth(x,y);
                    let calcD = (w1 * v1.d + w2 * v2.d + w3 * v3.d) / (w1+w2+w3);

                    if ( depth == undefined || depth > calcD ) {

                        // r = r * calcD;
                        // g = g * calcD;
                        // b = b * calcD; 

                        // console.log(calcD);

                        setPixel(x, y,r,g,b);
                        setDepth(x,y,calcD);
                    }
                }
            }
        }
    }

    function getPixel(x,y) {
        if ( img == null ) return;

        var px = new pixel();

        px.x = x;
        px.y = y;


        let dit = x + y * canvas.width;

        px.lastDepth = depthBuffer[dit];


        // let imgit = 
    }

    function setPixel(x,y,r,g,b) {

        var at = x + y * canvas.width;
        at *= 4;

        img.data[at] = r;
        img.data[at+1] = g;
        img.data[at+2] = b;
        img.data[at+3] = 255;

    }

    function setDepth(x,y,depth) {
        
        let dit = x + y * canvas.width;
        depthBuffer[dit] = depth;
    }

    function getDepth(x,y) {
        
        let dit = x + y * canvas.width;
        return depthBuffer[dit];
    }

    this.blit = function() {
        context.putImageData(img,0,0);
        img = null;
        depthBuffer = null;
    }
}