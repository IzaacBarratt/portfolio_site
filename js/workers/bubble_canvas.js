var canvasOffscreen = false;

var stageVals = {};
//var canvas;
var gl; 
var objContainer = [];


// Bubble Vars --------------
var objCount = 4;
var smallScreenCount = 5;

const baseMomentum = 1;
const momentumVal = 4;
const slowMomentum= 1.1;
const opacitySub = 0.7;
const radiusVals = {
    max: 200,
    min: 20
}

/*
onmessage = (e) => {
    console.log(e)

    if (e.data.render && render) {
        render(e.data.render)
    }

    if (e.data.animate) {
        console.log('render')
        render();
    }

    if (e.data.stageVals) {
        stageVals = e.data.stageVals;
    }

    if (e.data.hasOwnProperty('canvas')) {
        canvas = e.data.canvas;
        createContext(canvas);
    }
} 
*/
/*
function createContext(canvas) {
    //gl = canvas.getContext('2d', { alpha: false });

    for (var i = 0; i < objCount; i ++) {

        if (stageVals.w < 600 && i > smallScreenCount) {
            break;
        }

        objContainer.push(
            new CircleObj(stageVals.w, stageVals.h)
        )
    }
}


function render(dt) {

    //gl.commit();
    for (var i = 0; i < objContainer.length; i++) {
        objContainer[i].step();
    }

    //gl.commit();
}   
*/



let canvas;
let ctx;

function animate() {
  // do some animations ...

  /*
  ctx.beginPath();
    ctx.arc(10, 10, 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle =   '#ffffff';
    ctx.lineWidth   =   1;
    ctx.save();
    */

    for (var i = 0; i < objContainer.length; i ++) {
        objContainer[i].step();
    }

  console.log('animate')

  const bitmap = canvas.transferToImageBitmap();
  self.postMessage({msg: 'render', bitmap});
  self.requestAnimationFrame(animate);
}

self.onmessage = function(ev) {
  if(ev.data.msg === 'init') {
    canvas = ev.data.canvas;

    for (var i = 0; i < objCount; i ++) {
        objContainer.push(
            new CircleObj(100, 200)
        )
    }

    ctx = canvas.getContext('2d');
    animate();
  }
}




class CircleObj {

    constructor(stage_x, stage_y) {

        const radius = Math.random() * (radiusVals.max - radiusVals.min) + radiusVals.min;
        this.selfRadius = radius;

        var opacity = (radius / 100) > 1 ? 1 : radius / 100;
        opacity -= opacitySub;
        if (opacity < 0.1) { opacity = 0.1; }
        this.opacity = opacity;

        this.position = {
            x: Math.random() * stage_x,
            y: Math.random() * stage_y
        }

        this.momentum = Math.round(radius / 100) // made int for optimisation, floats can cause extra rendering
    }

    step(delta) {
        //this.primaryObj.clear();

        console.log('STEP')

        //this.primaryObj.position.x += this.momentum;
        this.position.x += this.momentum;
        
        /*
        if ((this.primaryObj.position.x - this.selfRadius) > stageVals.w) {
            this.primaryObj.position.x = -this.selfRadius;
        }
        */

        if ((this.position.x - this.selfRadius) > stageVals.w) {
            this.position.x = -this.selfRadius;
        }

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.selfRadius, 0, 2 * Math.PI);   
        ctx.stroke();
        ctx.strokeStyle =   '#ffffff';
        ctx.lineWidth   =   Math.ceil(this.selfRadius / 20);
        ctx.globalAlpha =   this.totalOpacity;
        ctx.save();
        /*
        this.primaryObj.arc(this.position.x, this.position.y, this.selfRadius, 0, 2 * Math.PI);   
        this.primaryObj.strokeStyle =   '#ffffff';
        this.primaryObj.lineWidth   =   Math.ceil(this.selfRadius / 20);
        this.primaryObj.globalAlpha =   this.totalOpacity;
        //this.primaryObj.commit();
        */
    }
}