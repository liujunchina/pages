/**
 * Created by Liu.Jun on 2016/10/11.
 */

// let wxShare = require('commonjs/wx-share.js');
// wxShare({
//     'imgUrl': window.location.origin + '/xxxxxx.jpg',
//     'link': window.location.href,
//     'desc': 'xxxxxx',
//     'title': 'xxxxxxxxxxxxxxxxxx',
// })

let popLayer = require('commonjs/popup-layer/popup-layer.js');

let x = popLayer.msg({
    title:'测试内容',
    content: '测试内容测试内容测试内容内容可以是html',
    tools: [
        {
            class: 'layer-btn-primary',
            text: '确定'
        }
    ]
})

// 保证只会同时加载一个 loading
// popLayer.loading({
//     content:'加载中'
// })

window.popLayer = popLayer;

// popLayer.layer({
//     content:' ',
// })