var Playbulb = require('./playbulb');

var pb = Playbulb();

var colorChange = function () {
    var r = rand(256), g = rand(256), b = rand(256);
    pb.setColor(r, g, b);
    setTimeout(colorChange, 100);
};
colorChange();

function rand(n) {
    return Math.floor(Math.random() * n);
}
