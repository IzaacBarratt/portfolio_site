window.onload = function() {

   init();
    
}

var animationVar;
var objCount = 15;
var smallScreenCount = 5;
var objContainer = [];
var stageVals = {};

const baseMomentum = 1;
const momentumVal = 4;
const slowMomentum= 1.1;
const opacitySub = 0.7;
const radiusVals = {
    max: 200,
    min: 20
}

var previous_time = new Date();


class CircleObj {

    constructor(stage_x, stage_y) {

        const radius = Math.random() * (radiusVals.max - radiusVals.min) + radiusVals.min;
        this.selfRadius = radius;

        //console.log(radius)
        //console.log(radius / 100)
        var opacity = (radius / 100) > 1 ? 1 : radius / 100;
        opacity -= opacitySub;
        if (opacity < 0.1) { opacity = 0.1; }
        //console.log((radius / 100) - 0.4)
        console.log(opacity)

        this.momentum = radius / 100 //* (stageVals.w < 600) ? slowMomentum : momentumVal;
        this.primaryObj = new paper.Path.Circle({
            center: [Math.random() * stage_x, Math.random() * stage_y],
            radius: radius
        })
        this.primaryObj.strokeColor = '#ffffff';
        this.primaryObj.strokeWidth = Math.ceil(radius / 20);
        this.primaryObj.opacity = opacity;

        console.log(this.primaryObj)
    }

    step(delta) {
        this.primaryObj.position.x += this.momentum;

        
        if ((this.primaryObj.position.x - this.selfRadius) > stageVals.w) {
            this.primaryObj.position.x = -this.selfRadius;
        }
        
    }
}




function init() {		

    var canvas = document.getElementById('canvas');
	// Create an empty project and a view for the canvas:
    paper.setup(canvas);
    
    console.log(paper)

    /*    
    var firstPath = new paper.Path.Circle({
        center: [80, 100],
        radius: 35
    });
    firstPath.strokeColor = '#ff0000';
    */

    stageVals = {
        w: paper.view.size.width,
        h: paper.view.size.height
    }

    for (var i = 0; i < objCount; i ++) {

        if (stageVals.w < 600 && i > smallScreenCount) {
            break;
        }

        objContainer.push(
            new CircleObj(paper.view.size.width, paper.view.size.height)
        )
    }

    animationVar = requestAnimationFrame(animate)
    console.log(objContainer)

    function animate() {

        var current_time = new Date();
        var delta_time = current_time - previous_time;
        previous_time = current_time;

        //firstPath.position.x += 10
        for (var i = 0; i < objContainer.length; i ++) {
            objContainer[i].step(delta_time);
        }

        animationVar = requestAnimationFrame(animate)
    }

    
    //cancelAnimationFrame(animationVar)
    //paper.view.draw();
  }



  