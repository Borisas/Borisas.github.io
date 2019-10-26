
var content = null;
var header = null;

window.onload = () => {

    content = document.getElementById('content');
    header = document.getElementById('header');
    
    createContentsView();
}

const contents = [

    new contentsData(
        "Evolutionary Snake AI", 
            `This was a 2 day project. I thought it was fun messing around
            with AI related things and I found evolutionary mutation to be a really
            interesting way of developing AI that plays simple games . Of course I didn't
            actually research neural networks or evolution algorithms. I prefer learning things
            by solving problems and trying to connect my understanding with working examples. 
            The AI and evolution are extremely simple - AI runs on a neural network, the neural network doesn't have
            biases or an activation function, all it does is multiply weights with values and add them up, choosing 
            the biggest one at the end. Evolution is really simple too, all it does is add random values to weights,
            the values change depending on AIs progress.`, 
        "view.html?proj=snake_ai"),

    new contentsData(
        "Sort Visualizer", 
            `This was a 1-2 day project. It started with me watching a video that
            showed different sort algorithms visualized. So I wanted to make something like that myself.
            It's not every good, the way you enter code is extremely convoluted, but it still does what I wanted.`, 
        "view.html?proj=sort_visualizer"),

    new contentsData(
        "Canvas 3D", 
            `This was a 2 day project. 
            I was interested in how to actually get 3d stuff drawn on the screen. 
            It wasn't about watching tutorials or doing any actualy research, 
            it was more like a problem i had to solve. 
            I wanted to figure out a way to draw something in 3d on my own without actually using any 3d renderer.
            So this entire thing is just running on basic HTML5 Canvas drawing functionality (lines and rectangles).
            Left Mouse Button to rotate.`, 
        "view.html?proj=canvas3d"),

    new contentsData(
        "MVP 3D",
        `I made this while waiting for some esports games to start.
        My motivation was trying to understand MVP matrixes better. Before starting this they were a sort of Black magic to me
        \"You mean i just put numbers here and suddenly it's flat?\" But as it turns out it's just a bunch of fancy matrix math.
        It was fun though. Also has a script part for animation, just so I could play around and preview it better.
        `,
        "view.html?proj=mvp3d"
    )

];

function contentsData(title, info, link) {

    this.title = title;
    this.info = info;
    this.link = link;
}


function createContentsView() {

    for ( let i = 0; i < contents.length; i++ ) {
        var item = createContentItem(contents[i].title, contents[i].info, contents[i].link);
        content.appendChild(item);
    }
}

function createContentItem(title, info, link) {

    var parser = new DOMParser();

    var domstr = `<div class='content-item'>
        <div class='content-item-header'>${title}</div>
        <div class='content-item-info' id='fill'>
            ${info}
        </div>
        <div class='content-item-footer'>
            <a href=\'${link}\'>View...</a>
        </div>
    </div>`;
    
    return parser.parseFromString(domstr, 'text/html').body.firstChild;  
}