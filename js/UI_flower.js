/**
 * Created by Richard on 2016/12/14.
 */
$(document).ready(function () {
    //初始化画板
    var zCanvas = $("#zCanvas");
    var zCanvasContainer = $("#zCanvasContainer");
    zCanvas.css("width", zCanvasContainer.css("width"));
    zCanvas.css("height", zCanvasContainer.css("width"));
});
var zCanvas = document.getElementById("zCanvas");
var Ctx = zCanvas.getContext("2d");
var Cw = zCanvas.width = 2000;
var Ch = zCanvas.height = 2000;
var can = document.createElement("canvas");
var ctx = can.getContext("2d");
var cw = can.width = 400,
    cx = cw / 2;
var ch = can.height = 400,
    cy = ch / 2;
var rad = Math.PI / 180;
var frames = 0;
var stopped = true;
var Rx = 150,
    Ry = 150,
    kx = 3,
    ky = 4,
    x, y, x1, y1, x2, y2, t;
var petals = 8;
var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rx * 1.2);
grd.addColorStop(0, "hsl(337,95%,52%)");
grd.addColorStop(.7, "hsl(220,66%,74%)");
grd.addColorStop(1, "hsl(305,48%,55%)");
ctx.strokeStyle = grd; //"hsl(210,100%,50%)";
ctx.globalAlpha = .5;
ctx.lineWidth = .25;
Ctx.translate(Cw / 2, Ch / 2);
Ctx.scale(.75, .75)
function Draw() {
    frames += .3;
    Ctx.clearRect(-Cw, -Ch, 2 * Cw, 2 * Ch);
    t = frames * rad;
    rx = Rx * Math.abs(Math.cos(t)) + 50;
    ry = Ry * Math.abs(Math.sin(t)) + 50;
    x = cx + rx * Math.sin(kx * t + Math.PI / 4);
    y = cy + ry * Math.sin(ky * t + Math.PI / 4);
    x1 = cx + rx * Math.sin(kx * t + 3 * Math.PI / 4);
    y1 = cy - ry * Math.sin(ky * t + 3 * Math.PI / 4);
    x2 = cx + rx * Math.sin(kx * t + 5 * Math.PI / 4);
    y2 = cy - ry * Math.sin(ky * t + 5 * Math.PI / 4);
    x3 = cx + rx * Math.sin(kx * t + 7 * Math.PI / 4);
    y3 = cy - ry * Math.sin(ky * t + 7 * Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(x, y);
    //ctx.lineTo(x1,y1);
    //	ctx.lineTo(x2,y2);
    //	ctx.lineTo(x3,y3);
    //ctx.quadraticCurveTo(x1,y1,x2,y2);
    ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
    ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    var img = can;
    for (var i = 0; i < petals; i++) {
        Ctx.globalCompositeOperation = "source-over";
        Ctx.drawImage(img, -200, -400);
        Ctx.rotate(2 * Math.PI / petals);
    }
    requestId = window.requestAnimationFrame(Draw);
}
function start() {
    requestId = window.requestAnimationFrame(Draw);
    stopped = false;
}
function stopAnim() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
    }
    stopped = true;
}
window.addEventListener("load", function() {
    start();
}, false);
function cleanSlate() {
    ctx.clearRect(0, 0, cw, ch);
    stopped = true;
    start();
    window.setTimeout(function() {
        stopAnim();
    }, 10000);
}
window.setTimeout(function() {
    stopAnim();
}, 10000);
zCanvas.addEventListener("click", function() {
    cleanSlate()
}, false);