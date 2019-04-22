let screen_worker = new Worker('js/workers/screen_worker.js');
let bubble_canvas = new Worker('js/workers/bubble_canvas.js');
screen_worker.addEventListener('message', collision);

 
window.onload = function() {
   //initBubbles();
   initLayoutAnims(); //todo THIS SHOULD SET animations to 0 opacity if thats their config before animating in  
   window.addEventListener("scroll", windowScroll);
}



// Elements-------

var canvasOnScreen = true; // Check if canvas is on screen to even animate

//-----------------

var animationVar;
var objCount = 15;
var smallScreenCount = 5;
var objContainer = [];
var stageVals = {};

var stopChecking = false; // Check animations have all finished - if so, stop checking to see if any are left

// Stats
var statsAnimated   = false;
const statsPre      = 100;
const statDelay     = 100;
const statContainer = document.getElementById('statBarContainers'); //.children;

// Profile
var profileAnimated = false;
const profilePre    = 0;
const profileDelay  = 100;
const profileContainer = document.getElementById('bio_profile');

// Experience
var experienceAnimated = false;
const experiencePre   = 100;
const experienceDelay = 100;
const experienceContainer = document.getElementById('bio_exp');

// Bio 
var bioAnimated = false;
const bioPre = 70;
const bioDelay = 100;
const bioContainer = document.getElementById('bio_container');

// Bio Text
//var bioTextAnimated = false;
const bioTextCont = document.getElementById('bio_container_content');

//Approach
var approachAnimated = false;
const approachPre = 0;
const approachDelay = 100;
const approachContainer = document.getElementById('approach_text');

// ----------------

var animCont = [
    {
        active: true,
        cont: statContainer,

    },
    {
        active: true,
        cont: profileContainer,
        config: {
            x: -200,
            y: 0,
            baseDelay: profilePre,
            delay: profileDelay,
            fadeIn: true
        }
    },
    {
        active: true,
        cont: experienceContainer,
        config: {
            x: 200,
            y: 0,
            baseDelay: experiencePre,
            delay: experienceDelay,
            offset: 0,
            fadeIn: true
        }
    },
    /*
    {
        active: true,
        cont: bioContainer,
        config: {
            x: 0,
            y: -60,
            baseDelay: bioPre,
            delay: bioDelay,
            fadeIn: true,
            offset: 100
        }
    },*/
    
    {
        active: true,
        cont: bioTextCont,
        config: {
            x: 0,
            y: 0,
            height: [0, 120],
            baseDelay: bioPre,
            delay: bioDelay,
            fadeIn: true,
            offset: 100
        }
    },

    {
        active: true,
        cont: approachContainer,
        config: {
            x: 100,
            y: -80,
            baseDelay: approachPre,
            delay: approachDelay,
            fadeIn: true,
            offset: 200
        }
    },

];


// Bubble Vars --------------
const baseMomentum = 1;
const momentumVal = 4;
const slowMomentum= 1.1;
const opacitySub = 0.7;
const radiusVals = {
    max: 200,
    min: 20
}



// Bubble Class + Functions ---------------

class CircleObj {

    constructor(stage_x, stage_y) {

        const radius = Math.random() * (radiusVals.max - radiusVals.min) + radiusVals.min;
        this.selfRadius = radius;

        var opacity = (radius / 100) > 1 ? 1 : radius / 100;
        opacity -= opacitySub;
        if (opacity < 0.1) { opacity = 0.1; }

        this.momentum = Math.round(radius / 100) // made int for optimisation, floats can cause extra rendering
        this.primaryObj = new paper.Path.Circle({
            center: [Math.random() * stage_x, Math.random() * stage_y],
            radius: radius
        })
        this.primaryObj.strokeColor = '#ffffff';
        this.primaryObj.strokeWidth = Math.ceil(radius / 20);
        this.primaryObj.opacity = opacity;

    }

    step(delta) {
        this.primaryObj.position.x += this.momentum;

        
        if ((this.primaryObj.position.x - this.selfRadius) > stageVals.w) {
            this.primaryObj.position.x = -this.selfRadius;
        }
        
    }
}

function initBubbles() {		

    var canvas = document.getElementById('canvas')//.transferControlToOffscreen();
    //var canvasB= document.getElementById('canvasB')
    //var canvasC= document.getElementById('canvasC')


    //canvas = canvas.getContext('2d')
    //console.log(canvas.getContext('webgl'))
    //console.log(canvas);

    //var canvas = document.getElementById('canvas');

    /*
    if (!('transferControlToOffscreen' in canvas)) {
        throw new Error('webgl in worker unsupported');
    }

    stageVals.h = canvas.scrollHeight;
    stageVals.w = canvas.scrollWidth;

    var offscreen = canvas.transferControlToOffscreen();
    bubble_canvas.postMessage({ stageVals: stageVals });
    bubble_canvas.postMessage({ canvas: offscreen }, [offscreen]);
    //bubble_canvas.postMessage({key: 'stageVals', value: stageVals });


    animationVar = requestAnimationFrame(animate)

    function animate() {
        console.log('animation called')
        bubble_canvas.postMessage({ animate: true });
        animationVar = requestAnimationFrame(animate);
    }

    */

    /*
   const ctx = canvas.getContext('bitmaprenderer');
   const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
   
   //const worker = new Worker('canvasworker.js');
   bubble_canvas.postMessage({msg: 'init', canvas: offscreenCanvas}, [offscreenCanvas]);
   console.log('started')
   
   bubble_canvas.addEventListener('message', function(ev) {
     if(ev.data.msg === 'render') {
       ctx.transferFromImageBitmap(ev.data.bitmap);
     }
   });
   */


   /*
    stageVals.h = canvas.scrollHeight;
    stageVals.w = canvas.scrollWidth;

    renderLayer([], [], stageVals.x, stageVals.y)
   */



    //return;
    
    
	// Create an empty project and a view for the canvas:
    paper.setup(canvas);

    stageVals = {
        w: paper.view.size.width,
        h: paper.view.size.height
    };
    //screen_worker.postMessage({key: 'stageVals', value: stageVals });


    const layerAllocation = objCount / 3;

    var canvases = [
        canvas,
        //canvasB,
        //canvasC
    ]


    for (var i = 0; i < 3; i ++) {
        for (var j = 0; j < layerAllocation; j ++) {

            const canv = canvases[i];
            //var ctx = canv.getContext();

            objContainer.push(
                new CircleObj(paper.view.size.width, paper.view.size.height)
            )

            // create bitmap of circles on the canvas - probalby duplicate it too, so that can be back to back
            // animate entire bitmaps move one way

        }
    }


    /*
    var imageData = context.getImageData(1, 0, context.canvas.width-1, context.canvas.height);
    context.putImageData(imageData, 0, 0);
    // now clear the right-most pixels:
    context.clearRect(context.canvas.width-1, 0, 1, context.canvas.height);
    */

    animationVar = requestAnimationFrame(animateLeft);


    function animateLeft() {

        var context = canvas.getContext('2d');

        var imageData = context.getImageData(1, 0, context.canvas.width-1, context.canvas.height);
        context.putImageData(imageData, 0, 0);
        // now clear the right-most pixels:
        context.clearRect(context.canvas.width-1, 0, 1, context.canvas.height);
        
        
        animationVar = requestAnimationFrame(animateLeft);
    }


    /*
    for (var i = 0; i < objCount; i ++) {

        if (stageVals.w < 600 && i > smallScreenCount) {
            break;
        }

        objContainer.push(
            //new CircleObj(paper.view.size.width, paper.view.size.height)

        )
    }*/


    //animationVar = requestAnimationFrame(animate)




    
    function animate() {

        if (canvasOnScreen === true) {

            for (var i = 0; i < objContainer.length; i ++) {
                objContainer[i].step();
            }
        }

        animationVar = requestAnimationFrame(animate)
    }
    
    //cancelAnimationFrame(animationVar)
}

// ----------



// Bubbles have 3 layers of depth,
// move whole canvas as a thing
// Make bitmaps of circles and then use two images to loop through 


function renderLayer(radius, depth, height, width) {

}



// Layout animation Funcs ----------------------

function initLayoutAnims() {

    var animLog = [];

    for (var i = 0; i < animCont.length; i ++ ) {

        const item = animCont[i];

        if (item.config != undefined) {
            item.cont.style.opacity = 0;
            item.cont.style.transform = `translate(${-item.config.x}px, ${-item.config.y}px)`;
        }

        animLog.push({
            top: item.cont.getBoundingClientRect().top,
            config: item.config || {},
            active: item.active,
            id: item.cont.id
        });
    }

    console.log(animLog)
    console.log(animLog.length + ' of ' + animCont.length)

    // Logs the items in the worker thread that handles screen animation - this way the scroll can be managed
    // off the main thread and send back an event when something needs animating
    screen_worker.postMessage({ key: 'animLog', value: animLog });
    screen_worker.postMessage({ key: 'window', value: { h: window.innerHeight, w: window.innerWidth } })
}   

function windowScroll() {
    //window.lastScrollTime = new Date().getTime()
    screen_worker.postMessage({ key: 'scroll', value: window.pageYOffset });
}

function collision(data) {

    const index     = data.data;
    const item      = animCont[index];
    const elem      = item.cont;
    const config    = item.config;
    
    console.log('animate: ' + item.id + ' index of: ' + index);

    switch(elem) {
        case statContainer: animateStats(); break;
        default: animateInChildren(elem, config);
    }
}







// Animation functions ----------
function animateStats() {

    if (statsAnimated === true) return;
    statsAnimated = true;

    const elems = statContainer.children;

    for (var i = 0; i < elems.length; i ++) {
        const item = elems[i];
        const value = item.dataset.percent;

        anime({
            targets: item,
            width: value + '%',
            delay: statDelay * i,
            opacity: 1,
            duration: 1100,

            easing: 'easeInOutExpo',
            complete: function() {
              item.innerHTML = value + '%';
            }
        });
    }
}

function animateInChildren(elem, config) {

    const children = elem.children;
    elem.style.opacity = 1;

    for (var i = 0; i < children.length; i ++) {

        children[i].style.opacity = 1;

        anime({
            targets: children[i],
            translateX: config.x,
            translateY: config.y,
            height: config.height,
            //scaleY: '10%',
            delay: config.delay * i + config.baseDelay,
            opacity: (config.fadeIn === true) ? [0, 1] : 1,
            easing: 'easeInOutExpo'
        });

    }
}