'use strict';
var noble = require('noble');

var Playbulb = function (playbulbName, serviceUuid, colorUuid, effectsUuid) {
    playbulbName = playbulbName || "Playbulb";
    serviceUuid = serviceUuid || "ff02";
    colorUuid = colorUuid || "fffc";
    effectsUuid = effectsUuid || "fffb";

    var colorChar, effectsChar;
    var yesReady = false;
    var waiting = [];
    var modes = {
        FLASH: 0,
        PULSE: 1,
        RAINBOWJUMP: 2,
        RAINBOWFADE: 3
    };

    var isReady = function (callback) {
        if (callback) {
            if (yesReady) {
                setTimeout(callback, 0); // run async
            } else {
                waiting.push(callback);
            }
        } else if (colorChar !== null && effectsChar !== null) {
            yesReady = true;
            var waiter;
            while (waiting.length > 0) {
                waiter = waiting.pop(0);
                setTimeout(waiter, 0); // run each waiter async
            }
        }
    };

    var decimalToHexBytes = function (speed, max) {
        var speedRanged = speed * max;
        var speedHex = speedRanged.toString(16);
        while (speedHex.length < 4) {
            speedHex = "0" + speedHex;
        }
        return [parseInt(speedHex.substring(0, 2), 16), parseInt(speedHex.substring(2, 4), 16)];
    };

    var runEffect = function (r, g, b, effect, speed) {
        if (!isReady) {
            throw "playbulb not ready";
        }
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw "r, g and b must be between 0 and 255";

        }
        if (effect !== null) {
            if (speed < 0 || speed > 1) {
                throw "speed must be between 0 and 1";
            }
            speed = 1 - speed; // 0 is slow, 1 is fast
            var max = effect === modes.PULSE ? 7710 : 17990;
            var speedBytes = decimalToHexBytes(speed, max); // max hex is: 1E 1E
            var effectBytes = new Buffer([0, r, g, b, effect, 0, speedBytes[0], speedBytes[1]]);
            effectsChar.write(effectBytes);
        } else {
            var colorBytes = new Buffer([0, r, g, b]);
            colorChar.write(colorBytes);
        }
    };

    noble.startScanning();
    noble.on('discover', function (peripheral) {
        if (peripheral.advertisement.localName === playbulbName) {
            peripheral.connect(function (error) {
                if (error) {
                    throw error;
                }
                peripheral.discoverAllServicesAndCharacteristics();
                peripheral.on('servicesDiscover', function (services) {
                    services.map(function (service) {
                        if (service.uuid === serviceUuid) {
                            service.on('characteristicsDiscover', function (characteristics) {
                                characteristics.map(function (characteristic) {
                                    if (characteristic.uuid === colorUuid) {
                                        colorChar = characteristic;
                                        isReady();
                                    } else if (characteristic.uuid === effectsUuid) {
                                        effectsChar = characteristic;
                                        isReady();
                                    }
                                });
                            });
                        }
                    });
                });
            });
        }
    });


    return {
        setColor: function (r, g, b) {
            runEffect(r, g, b);
        },
        setPulse: function (r, g, b, speed) {
            runEffect(r, g, b, modes.PULSE, speed);
        },
        setFlash: function (r, g, b, speed) {
            runEffect(r, g, b, modes.FLASH, speed);
        },
        setRainbowJump: function (r, g, b, speed) {
            runEffect(r, g, b, modes.RAINBOWJUMP, speed);
        },
        setRainbowFade: function (r, g, b, speed) {
            runEffect(r, g, b, modes.RAINBOWFADE, speed);
        },
        ready: function (callback) {
            isReady(callback);
        }
    };
};

module.exports = Playbulb;
