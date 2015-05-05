var noble = require('noble');

// look out for this name
var playbulbName = "Playbulb";
var serviceUuid = "ff02";
var colorUuid = "fffc";

noble.startScanning();
noble.on('discover', function (peripheral) {
    if (peripheral.advertisement.localName == playbulbName) {
//        console.log("peripheral", peripheral);
        peripheral.connect(function (error) {
//            console.log("peripheral connect error", error);
            peripheral.discoverAllServicesAndCharacteristics();
            peripheral.on('servicesDiscover', function (services) {
//                console.log("services", services);
                services.map(function (service) {
                    if (service.uuid != serviceUuid) {
                        return;
                    };

//                    console.log("service", service);
                    service.on('includedServicesDiscover', function (includedServiceUuids) {
                        console.log("includedServiceUuids", includedServiceUuids);
                    });
                    service.on('characteristicsDiscover', function (characteristics) {
//                        console.log("characteristics", characteristics);

                        characteristics.map(function (characteristic) {
                            if (characteristic.uuid == colorUuid) {
                                console.log(characteristic);
                                var colorChange = function () {
                                    console.log("writing");
                                    var color = new Buffer(4);
                                    color[0] = 0;
                                    color[1] = rHex();
                                    color[2] = rHex();
                                    color[3] = rHex();
                                    console.log(color);
                                    characteristic.write(color);
                                    setTimeout(colorChange, 100);
                                };
                                colorChange();
                            }
                            /*
                            characteristic.discoverDescriptors(function (error, descriptors) {

                            });
                            */
                        });
                    });
                });
            });
        });
    }
});

function rHex() {
    return Math.floor(Math.random() * 256);
}

