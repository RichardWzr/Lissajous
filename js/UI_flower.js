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
//花瓣数目
var petals = 12;
var zCanvas = document.getElementById("zCanvas");
var WindowCtx = zCanvas.getContext("2d");
var WindowWidth = zCanvas.width = 800;
var WindowHeight = zCanvas.height = 800;
var petalCanvas = document.createElement("canvas");
var PetalCtx = petalCanvas.getContext("2d");
var PetalWidth = petalCanvas.width = 400,
    cx = PetalWidth / 2;
var PetalHeight = petalCanvas.height = 400,
    cy = PetalHeight / 2;
//单位角速度
var rad = Math.PI / 180;
//移动步长
var frames = 0;
var requestId = 0;
var stopped = true;
var Rx = 150, Ry = 150, kx = 2, ky = 3,
    x, y, x1, y1, x2, y2, t, rx, ry, x3, y3;
var grd = PetalCtx.createRadialGradient(cx, cy, 0, cx, cy, Rx * 1.2);
grd.addColorStop(0, "hsl(337,95%,52%)");
grd.addColorStop(.7, "hsl(220,66%,74%)");
grd.addColorStop(1, "hsl(305,48%,55%)");
PetalCtx.strokeStyle = grd; //"hsl(210,100%,50%)";
PetalCtx.globalAlpha = .5;
PetalCtx.lineWidth = .25;
//转换坐标系
WindowCtx.translate(WindowWidth / 2, WindowHeight / 2);
//缩放画布
WindowCtx.scale(.75, .75);
function Draw() {
    frames += .3;
    WindowCtx.clearRect(-WindowWidth, -WindowHeight, 2 * WindowWidth, 2 * WindowHeight);
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
    PetalCtx.beginPath();
    PetalCtx.moveTo(x, y);
    //做贝塞尔曲线
    PetalCtx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    PetalCtx.stroke();
    PetalCtx.globalCompositeOperation = "lighter";
    for (var i = 0; i < petals; i++) {
        WindowCtx.globalCompositeOperation = "source-over";
        WindowCtx.drawImage(petalCanvas, -200, -400);
        //旋转一个角度继续画
        WindowCtx.rotate(2 * Math.PI / petals);
    }
    requestId = window.requestAnimationFrame(Draw);
}
//启动程序
function start() {
    requestId = window.requestAnimationFrame(Draw);
    stopped = false;
}
start();
window.setTimeout(function () {
    stopAnimate();
}, 6000);
//添加画板点击事件
zCanvas.addEventListener("click", function () {
    cleanSlate()
}, false);
//停止动画
function stopAnimate() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
    }
    stopped = true;
}
//清空画板，重来
function cleanSlate() {
    PetalCtx.clearRect(0, 0, PetalWidth, PetalHeight);
    stopped = true;
    start();
    window.setTimeout(function () {
        stopAnimate();
    }, 6000);
}