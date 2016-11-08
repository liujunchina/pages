/**
 * Created by Liu.Jun on 2016/11/7.
 */

let cacheToken ;

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
            url: '/airport/Index/getAuth',  // 机场
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