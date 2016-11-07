/**
 * Created by Liu.Jun on 2016/11/7.
 */

let cacheToken ;

// 测试数据
cacheToken = {
    "appId": "wx011ea03e123f4d2c",
    "timestamp": "1478510597",
    "nonceStr": "1478510597724",
    "signature": "34162154f418af7d287a110faf1d731be301b2be",
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'previewImage', 'chooseImage', 'uploadImage', 'downloadImage', 'getLocation']
}

function setWxConfig({appId,timestamp,nonceStr,signature}) {
    wx.config({
        // debug: true,
        appId: appId,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'scanQRCode'
        ]
        // jsApiList: [
        //     'onMenuShareTimeline',
        //     'onMenuShareAppMessage',
        //     'onMenuShareQQ',
        //     'onMenuShareWeibo',
        //     'hideMenuItems',
        //     'previewImage',
        //     'chooseImage',
        //     'uploadImage',
        //     'downloadImage',
        //     'getLocation'
        // ]
    });
}

module.exports = function (callback,useCacheToken = true) {
    if(useCacheToken && undefined != cacheToken){
        setWxConfig(cacheToken);
        callback.call(null,cacheToken);
    }else{
        $.ajax({
            async: true,
            type: 'post',
            dataType: 'json',
            url: '/api/weixin/partake.jsp',
            data: {
                url: window.location.href.split('#')[0]
            }
        }).done(({errCode, obj})=> {
            if(errCode === 0){
                cacheToken = obj;
                setWxConfig(cacheToken);
                callback.call(null,cacheToken);
            }
        });
    }
};