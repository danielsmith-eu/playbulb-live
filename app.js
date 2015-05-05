var Playbulb = require('./playbulb');

var pb = Playbulb();

pb.ready(function () {

    var change = function () {
        var r = rand(256), g = rand(256), b = rand(256);
        pb.setColor(r, g, b);
        setTimeout(change, 100);
    };
    //change();

    pb.setPulse(255,0,255,1);
});


function rand(n) {
    return Math.floor(Math.random() * n);
}
