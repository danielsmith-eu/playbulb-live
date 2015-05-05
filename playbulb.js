var noble = require('noble');

var Playbulb = function (playbulbName, serviceUuid, colorUuid, effectsUuid) {
    playbulbName = playbulbName || "Playbulb";
    serviceUuid = serviceUuid || "ff02";
    colorUuid = colorUuid || "fffc";
    effectsUuid = effectsUuid || "fffb";

    var colorChar, effectsChar;

    var yesReady = false;
    var waiting = [];
    var isReady = function (callback) {
        if (callback) {
            if (yesReady) {
                callback();
            } else {
                waiting.push(callback);
            }
        } else if (colorChar != null && effectsChar != null) {
            yesReady = true;
            while (waiting.length > 0) {
                var waiter = waiting.pop(0);
                waiter();
            }
        }
    };

    noble.startScanning();
    noble.on('discover', function (peripheral) {
        if (peripheral.advertisement.localName == playbulbName) {
            peripheral.connect(function (error) {
                peripheral.discoverAllServicesAndCharacteristics();
                peripheral.on('servicesDiscover', function (services) {
                    services.map(function (service) {
                        if (service.uuid == serviceUuid) {
                            service.on('characteristicsDiscover', function (characteristics) {
                                characteristics.map(function (characteristic) {
                                    if (characteristic.uuid == colorUuid) {
                                        colorChar = characteristic;
                                        isReady();
                                    } else if (characteristic.uuid == effectsUuid) {
                                        effectsChar = characteristic;
                                        isReady();
                                    }
                                });
                            });
                        };
                    });
                });
            });
        }
    });

    var modes = {
        FLASH: 0,
        PULSE: 1,
        RAINBOWJUMP: 2,
        RAINBOWFADE: 3,
    };

    var decimalToHexBytes = function (speed, max) {
            var speedRanged = speed * max;
            var speedHex = speedRanged.toString(16);
            while(speedHex.length < 4) {
                speedHex = "0" + speedHex;
            }
            return [parseInt(speedHex.substring(0, 2), 16), parseInt(speedHex.substring(2, 4), 16)];
    };

    return {
        setColor: function (r, g, b) {
            if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
                throw new Exception("in setColor r, g and b must be between 0 and 255");
            }
            var color = new Buffer([0, r, g, b]);
            if (colorChar) {
                colorChar.write(color);
            }
        },
        setPulse: function (r, g, b, speed) {
            if (speed < 0 || speed > 1) { 
                throw new Exception("in setPulse speed must be between 0 and 1");
            }
            speed = 1 - speed; // 0 is slow, 1 is fast
            var speedBytes = decimalToHexBytes(speed, 17990); // max hex is: 46 46
            var effect = new Buffer([0, r, g, b, modes.PULSE, 0, speedBytes[0], speedBytes[1]]);
            console.log(effect);
            if (effectsChar) {
                effectsChar.write(effect);
            } 
        },
        ready: function (callback) {
            isReady(callback);
        },
    }
};

module.exports = Playbulb;
