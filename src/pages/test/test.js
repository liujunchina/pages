/**
 * Created by Liu.Jun on 2016/10/11.
 */

// let wxShare = require('commonjs/wx-share.js');

let popLayer = require('commonjs/popup-layer/popup-layer.js');

let x = popLayer.msg({
    isShowMask: true,
    title:'测试标题',
    content:'测试内容测试内容测试内容内容可以是html',
    onClose:false,
    style: 1,
    tools:[
        {
            class: 'layer-btn-default',
            text: '关闭',
            onClick:function () {
                debugger
            }
        },
        {
            class: 'layer-btn-primary',
            text: '确定',
            onClick:false
        }
    ]
})

// wxShare({
//     'imgUrl': window.location.origin + '/xxxxxx.jpg',
//     'link': window.location.href,
//     'desc': 'xxxxxx',
//     'title': 'xxxxxxxxxxxxxxxxxx',
// })