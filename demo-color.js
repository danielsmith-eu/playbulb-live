'use strict';
var Playbulb = require('./playbulb');

function randInt(n) {
    return Math.floor(Math.random() * n);
}

var pb = new Playbulb.PlaybulbColor();
pb.ready(function () {
    console.log("Playbulb Color Demo Mode");
    var flashMax = 20;
    var doEffects = function (effectNum) {
        var r = randInt(256), g = randInt(256), b = randInt(256);
        switch (effectNum) {
            default:
            case 0:
                console.log("Running PULSE effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setPulse(0, r, g, b, 1.0);
                break;
            case 1:
                console.log("Running FLASH effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setFlash(0, r, g, b, 1.0);
                break;
            case 2:
                console.log("Running RAINBOW JUMP effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setRainbowJump(0, r, g, b, 1.0);
                break;
            case 3:
                console.log("Running RAINBOW FADE effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setRainbowFade(0, r, g, b, 1.0);
                break;
            case 4:
                setTimeout(function () { changeColours(flashMax); }, 2500);
                return;
        }
        setTimeout(function() { doEffects(effectNum + 1); }, 5000);
    };
    var changeColours = function (flashCount) {
        if (flashCount === 0) {
            doEffects(0);
        } else {
            var r = randInt(256), g = randInt(256), b = randInt(256);
            console.log("Setting colour to red: " + r + ", green: " + g + ", blue: " + b);
            pb.setColor(0, r, g, b);
            setTimeout(function() { changeColours(flashCount - 1); }, 100);
        }
    };
    changeColours(flashMax);
});
