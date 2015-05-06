# Playbulb-live

Node.js module for sending commands to the bluetooth Playbulb Candle and Playbulb Color.

Uses `noble` for BLE communication, and protocol from `https://github.com/Phhere/Playbulb/blob/master/protocols/color.md`

Usage:

    var Playbulb = require('playbulb');
    var pb = new Playbulb.PlaybulbCandle();
    pb.ready(function () {
        pb.setColor(0, 255, 0, 255); // set fixed color in Saturation, R, G, B
    });

