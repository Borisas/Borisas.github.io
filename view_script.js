
var content = null;
var header = null;
var github = null;
var errored = false;


var link = "";
var name = "";
var githubLink = "";

var iframe = null;

window.onload = () => {

    content = document.getElementById('content');
    header = document.getElementById('header');
    github = document.getElementById('github-link');

    const urlParams = new URLSearchParams(window.location.search);
    const proj = urlParams.get('proj');

    console.log('proj = ' + proj);

    if ( proj == null || proj == undefined ) {
        loadNone();
        return
    }
    
    loadProj(proj);
}


function initData(projName) {

    if ( projName === "snake_ai" ) {
        link = "snake_ai/index.html";
        name = "snake_ai";
        githubLink = "https://github.com/Borisas/Borisas.github.io/tree/master/snake_ai";
    }
    else if ( projName === "canvas3d" ) {
        link = "canvas3d/index.html";
        name = "canvas3d";
        githubLink = "https://github.com/Borisas/Borisas.github.io/tree/master/canvas3d";
    }
    else if ( projName === "sort_visualizer" ) {
        link = "sort_visualizer/index.html";
        name = "sort_visualizer";
        githubLink = "https://github.com/Borisas/Borisas.github.io/tree/master/sort_visualizer";
    }
    else if ( projName === "mvp3d" ) {
        link = "mvp3d/index.html";
        name = "mvp3d";
        githubLink = "https://github.com/Borisas/Borisas.github.io/tree/master/mvp3d";
    }
    else {
        errored = true;
    }

}

function loadNone() {

}


function loadProj(projectName) {

    initData(projectName);

    if ( errored ) {
        loadNone();
        return;
    }


    var iframe = createIframe(link);
    content.innerHTML = "";
    content.appendChild(iframe);

    header.innerHTML = "/dev/NT/"+name;
    github.href = githubLink;


}

function resizeIFrameToFitContent() {

    console.log(iframe);

    iframe.width  = iframe.contentWindow.document.body.scrollWidth;
    iframe.height = iframe.contentWindow.document.body.scrollHeight;
}

function createIframe(src) {
    
    var frame = document.createElement('iframe');
    frame.src = src;
    frame.id = 'iframe';
    frame.className = 'full';
    frame.width = content.offsetWidth;
    frame.height = content.offsetHeight;
    iframe = frame;

    frame.onload = () => {
        
        resizeIFrameToFitContent();
    }

    return frame;
}