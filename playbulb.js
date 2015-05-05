var noble = require('noble');

var Playbulb = function (playbulbName, serviceUuid, colorUuid, effectsUuid) {
    playbulbName = playbulbName || "Playbulb";
    serviceUuid = serviceUuid || "ff02";
    colorUuid = colorUuid || "fffc";
    effectsUuid = effectsUuid || "fffb";

    var colorChar;

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
                                    }
                                });
                            });
                        };
                    });
                });
            });
        }
    });

    return {
        setColor: function (r, g, b) {
            var color = new Buffer([0, r, g, b]);
            if (colorChar) {
                colorChar.write(color);
            }
        }
    };
};

module.exports = Playbulb;
