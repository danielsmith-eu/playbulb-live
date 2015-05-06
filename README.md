# Playbulb-live

Node.js module for sending commands to the Playbulb bluetooth candle.

Uses `noble` for BLE communication, and protocol from `https://github.com/Phhere/Playbulb/blob/master/protocols/color.md`

Usage:

    var Playbulb = require('playbulb');
    var pb = new Playbulb();
    pb.ready(function () {
        pb.setColor(255,0,255); // set fixed color in RGB
    });

