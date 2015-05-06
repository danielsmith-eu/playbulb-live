'use strict';
var Playbulb = require('./playbulb');

function randInt(n) {
    return Math.floor(Math.random() * n);
}

var pb = new Playbulb.PlaybulbCandle();
pb.ready(function () {
    console.log("Playbulb Candle Demo Mode");
    var flashMax = 20;
    var doEffects = function (effectNum) {
        var r = randInt(256), g = randInt(256), b = randInt(256);
        switch (effectNum) {
            default:
            case 0:
                console.log("Running FADE effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setFade(0, r, g, b, 1.0);
                break;
            case 1:
                console.log("Running JUMPRGB effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setJumpRGB(0, r, g, b, 1.0);
                break;
            case 2:
                console.log("Running FADERGB effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setFadeRGB(0, r, g, b, 1.0);
                break;
            case 3:
                console.log("Running FLICKER effect at max speed with red: " + r + ", green: " + g + ", blue: " + b);
                pb.setFlicker(0, r, g, b, 1.0);
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
