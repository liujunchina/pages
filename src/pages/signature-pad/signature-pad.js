require('./css/signature-pad.css');
import SignaturePad from './signature_pad.mjs'

var wrapper = document.getElementById("signature-pad"),
    clearButton = wrapper.querySelector("[data-action=clear]"),
    saveButton = wrapper.querySelector("[data-action=save]"),
    plusButton = wrapper.querySelector("[data-action=plus]"),
    lessButton = wrapper.querySelector("[data-action=less]"),
    canvas = wrapper.querySelector("canvas"),
    signaturePad,

    curWidth = 375, //目标画板宽度 px
    curHeight,
    scale,
    init = false;

const transformPx = function (num) {
    return Number((num/scale).toFixed(4))
};

function initSignaturePad(width = 750,height = 1500) {
    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.

    scale = width/curWidth;
    curHeight = transformPx(height);

    canvas.width = curWidth;
    canvas.height = curHeight;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        // canvas.width = canvas.offsetWidth * ratio;
        // canvas.height = canvas.offsetHeight * ratio;
        // canvas.getContext("2d").scale(ratio, ratio);
    }

    window.onresize = resizeCanvas;
    resizeCanvas();

    signaturePad = new SignaturePad(canvas,{
        minWidth: 1,
        maxWidth: 1
    });

    clearButton.addEventListener("click", function (event) {
        signaturePad.clear();
    });

    saveButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
            alert("Please provide signature first.");
        } else {
            window.open(signaturePad.toDataURL());
        }
    });
}
// - ----------------------------

var wsServer = 'ws://192.168.50.20:3000/Demo'; //服务器地址
var websocket = new WebSocket(wsServer); //创建WebSocket对象

websocket.onopen = function (evt) {
//已经建立连接
};
websocket.onclose = function (evt) {
//已经关闭连接
};
websocket.onmessage = function ({data}) {
//收到服务器消息，使用evt.data提取

    let point = JSON.parse(data);
    console.log(point);

    if(undefined != point.touchEvent){
        if(!init){
            initSignaturePad(point.sketchpadWidth,point.sketchpadHeight,point.dpi)
            init = true;
        }

        point.x = transformPx(point.x);
        point.y = transformPx(point.y);

        if(point.touchEvent === 0){
            // 重置画笔
            signaturePad.minWidth = transformPx(point.penMinWidth / 3);
            signaturePad.maxWidth = transformPx(point.penMaxWidth / 3);
            signaturePad.penColor = String(data.penColor).indexOf('#') > 0 ? String(data.penColor) : 'black';
            // signaturePad.dotSize = point.penWidth / 5;

            signaturePad.actionDown(point);

        }else if(point.touchEvent === 1){
            signaturePad.actionUp(point)
        }else{
            signaturePad.actionMove(point)
        }
    }
};
websocket.onerror = function (evt) {
//产生异常
};

