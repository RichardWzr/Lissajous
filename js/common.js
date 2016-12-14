/**
 * Created by Richard on 2016/12/14.
 */
$(document).ready(function () {
    //初始化画板
    var zCanvas = $("#zCanvas");
    var zCanvasContainer = $("#zCanvasContainer");
    zCanvas.css("width", zCanvasContainer.css("width"));
    zCanvas.css("height", zCanvasContainer.css("width"));
    initVariable();
    refreshFormAndStatus();
});
//x和y的坐标点
var x_point = $("#x_point");
var y_point = $("#y_point");
//x轴的振幅
var x_a = $("#x_a");
var x_a_input = $("#x_a_input");
var x_a_val;
//y轴的振幅
var y_b = $("#y_b");
var y_b_input = $("#y_b_input");
var y_b_val;
//频率比
var xy_n = $("#xy_n");
var xy_n_input_x = $("#xy_n_input_x");
var xy_n_input_y = $("#xy_n_input_y");
var xy_n_val_x;
var xy_n_val_y;
var pencil = null;
var xy_w = $("#xy_w");
var xy_w_input_x = $("#xy_w_input_x");
var xy_w_input_y = $("#xy_w_input_y");
var xy_w_val_x;
var xy_w_val_y;
var can = document.getElementById("zCanvas");
var ctx = can.getContext("2d");
var x_actionTimeOutId;
var y_actionTimeOutId;
var clearLineButton = $("#clearLineButton");
var stop = 0;
var coordinateButton = $("#coordinateButton");
var coordinate = 0;
clearLineButton.click(function () {
    clearLine();
});
coordinateButton.click(function () {
   openCoordinate();
});
function initVariable() {
    x_a_val = 3;
    y_b_val = 3;
    xy_n_val_x = 3;
    xy_n_val_y = 1;
    xy_w_val_x = 1;
    xy_w_val_y = 2;
    xy_n_input_x.val(xy_n_val_x);
    xy_n_input_y.val(xy_n_val_y);
    xy_w_input_x.val(xy_w_val_x);
    xy_w_input_y.val(xy_w_val_y);
    y_b_input.val(y_b_val);
    x_a_input.val(x_a_val);
}
function refreshFormAndStatus() {
    x_a.html(x_a_val);
    y_b.html(y_b_val);
    xy_n.html(xy_n_val_x/xy_n_val_y);
    xy_w.html(xy_w_val_x/xy_w_val_y);
}
function read() {
    x_a_val = x_a_input.val();
    y_b_val = y_b_input.val();
    xy_n_val_x = xy_n_input_x.val();
    xy_n_val_y = xy_n_input_y.val();
    xy_w_val_x = xy_w_input_x.val();
    xy_w_val_y = xy_w_input_y.val();
    refreshFormAndStatus();
}
function drawLSR_before() {
    var timestamp_x = 0;
    var timestamp_y = 0;
    var Sprite = function () {
        this.stopx = stop;
        this.stopy = stop;
    };
    Sprite.prototype = {
        draw: function () {
        },
        sin_x: function () {
            this.x += x_a_val * Math.sin(timestamp_x);
            timestamp_x += 0.009;
            x_point.html(this.x);
        },
        sin_y: function () {
            this.y += y_b_val * Math.sin(xy_n_val_x/xy_n_val_y * timestamp_y + xy_w_val_x/xy_w_val_y * Math.PI);
            timestamp_y += 0.009;
            y_point.html(this.y);
        },
        sin_x_clear:function () {
            this.x += x_a_val * Math.sin(timestamp_x);
            timestamp_x += 0.009;
            x_point.html(this.x);
            ctx.clearRect(0, 0, 2000, 2000);
        },
        sin_y_clear:function () {
            this.y += y_b_val * Math.sin(xy_n_val_x/xy_n_val_y * timestamp_y + xy_w_val_x/xy_w_val_y * Math.PI);
            timestamp_y += 0.009;
            y_point.html(this.y);
            ctx.clearRect(0, 0, 2000, 2000);
        }
    };
    var Point = function (ctx, x, y, radius) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.propotity = {
            fillStyle: "#9B30FF",
            strokeStyle: "#9B30FF",
            lineWidth: "1"
        }
    };
    Point.prototype = new Sprite();
    Point.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.propotity.lineWidth;
        this.ctx.strokeStyle = this.propotity.strokeStyle;
        this.ctx.fillStyle = this.propotity.fillStyle;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    };
    pencil = new Point(ctx, 1000, 1000, 2);
}
function drawLSR() {
    read();
    pencil.draw();
    function x_action() {
        if (pencil.stopx == 0) {
            pencil.sin_x();
            pencil.draw();
            x_actionTimeOutId = setTimeout(x_action, 1);
        }else{
            pencil.sin_x_clear();
            pencil.draw();
            x_actionTimeOutId = setTimeout(x_action, 1);
        }
    }

    function y_action() {
        if (pencil.stopy == 0) {
            pencil.sin_y();
            pencil.draw();
            y_actionTimeOutId = setTimeout(y_action, 1);
        }else{
            pencil.sin_y_clear();
            pencil.draw();
            y_actionTimeOutId = setTimeout(y_action, 1);
        }
    }
    x_action();
    y_action();
}
function clear() {
    ctx.clearRect(0, 0, 2000, 2000);
    clearTimeout(x_actionTimeOutId);
    clearTimeout(y_actionTimeOutId);
}
function buttonStart() {
    if (pencil != null) {
        clear(pencil);
    }
    if(coordinate==1){
        openCoordinate();
    }
    drawLSR_before();
    drawLSR();
}
function clearLine() {
    if(pencil!=null){
        stop = 1;
        pencil.stopx = 1;
        pencil.stopy = 1;
    }
    clearLineButton.html("开启轨迹线");
    clearLineButton.removeClass("am-btn-warning");
    clearLineButton.addClass("am-btn-success");
    clearLineButton.click(function () {
        addLine();
    });
}
function addLine() {
    if(pencil!=null){
        stop = 0;
        pencil.stopx = 0;
        pencil.stopy = 0;
    }
    if(coordinate==1){
        openCoordinate();
    }
    clearLineButton.html("关闭轨迹线");
    clearLineButton.removeClass("am-btn-success");
    clearLineButton.addClass("am-btn-warning");
    clearLineButton.click(function () {
        clearLine();
    });
}
function openCoordinate() {
    coordinate = 1;
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(0,1000);
    ctx.lineTo(2000,1000);
    ctx.moveTo(1000,0);
    ctx.lineTo(1000,2000);
    ctx.stroke();
    ctx.closePath();
    coordinateButton.html("关闭坐标系");
    coordinateButton.click(function () {
        closeCoordinate();
    });
}
function closeCoordinate() {
    coordinate = 0;
    ctx.clearRect(0, 0, 2000, 2000);
    if(pencil!=null){
        buttonStart();
    }
    coordinateButton.html("打开坐标系");
    coordinateButton.click(function () {
        openCoordinate();
    });
}
