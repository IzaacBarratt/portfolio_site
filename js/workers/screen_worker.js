var canvasOnScreen  =   true;
var stopChecking    =   false; 

var stageVals   = {};
var windowVals  = {};
var animLog     = [];


onmessage = (e) => {
    const data = e.data;

    if (data.key === 'stageVals') {
        stageVals = data.value;
        return;
    }

    if (data.key === 'scroll') {
        scrollCheck(data.value);
    }

    if (data.key === 'animLog') {
        animLog = data.value;
    }

    if (data.key === 'window') {
        windowVals = data.value;
    }
} 


function scrollCheck(scroll) {
    var oneActive = false;

    if (scroll > (stageVals.h )) {
        canvasOnScreen = false;
    } else {
        canvasOnScreen = true;
    }

    if (stopChecking === true) return;

    for (var i = 0; i < animLog.length; i ++) {

        const item      = animLog[i];
        const id        = item.id
        const config    = item.config;
        const config_offset = (config && config.offset) ? config.offset : 0;

        if (item.active === false) continue;
        oneActive = true; // check if even a single item isn't false

        const offset    =   item.top - (scroll + (config_offset)) - (windowVals.h / 2);

        if (offset < 0) { 
            self.postMessage(i);
            animLog[i].active = false;
        }
    }

    // If no items are active - stop checking scroll mechanic
    if (oneActive === false) {
        stopChecking = true;
    }
}