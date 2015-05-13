# Playbulb-live

[![NPM](https://nodei.co/npm/playbulb.png?downloads=true&stars=true)](https://nodei.co/npm/playbulb/)

Node.js module for sending commands to the bluetooth Playbulb Candle and Playbulb Color.

Uses `noble` for BLE communication, and protocol from `https://github.com/Phhere/Playbulb/blob/master/protocols/color.md`

Usage:

    var Playbulb = require('playbulb');
    var pb = new Playbulb.PlaybulbCandle();
    pb.ready(function () {
        pb.setColor(0, 255, 0, 255); // set fixed color in Saturation, R, G, B
    });

## Twitter Demo

There is a demo in `demo-twitter.js` that opens a continuous stream of tweets, performs sentiment analysis on the text, and turns the light green if the sentiment is positive, and red if it is negative.

To get this working, copy `demo-twitter-config.js.example` to `demo-twitter-config.js` and fill in your access keys from `https://apps.twitter.com/`

