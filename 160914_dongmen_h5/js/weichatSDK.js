  wx.config({
    debug: false,
    appId: a,
    timestamp: b,
    nonceStr: c,
    signature: d,
    jsApiList: [
       'checkJsApi',
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage',
                  'onMenuShareQQ',
                  'onMenuShareWeibo',
                  'hideMenuItems',
                  'showMenuItems',
                  'hideAllNonBaseMenuItem',
                  'showAllNonBaseMenuItem',
                  'translateVoice',
                  'startRecord',
                  'stopRecord',
                  'onRecordEnd',
                  'playVoice',
                  'pauseVoice',
                  'stopVoice',
                  'uploadVoice',
                  'downloadVoice',
                  'chooseImage',
                  'previewImage',
                  'uploadImage',
                  'downloadImage',
                  'getNetworkType',
                  'openLocation',
                  'getLocation',
                  'hideOptionMenu',
                  'showOptionMenu',
                  'closeWindow',
                  'scanQRCode',
                  'chooseWXPay',
                  'openProductSpecificView',
                  'addCard',
                  'chooseCard',
                  'openCard'
    ]
  });
  wx.ready(function () {
    // 在这里调用 API
    //分享到朋友圈
    wx.onMenuShareTimeline({
    title: wc_title, // 分享标题
    link: wc_link, // 分享链接
    imgUrl: wc_imgurl, // 分享图标
    success: function () {
      alert("分享成功");
        // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        //alert("您取消了分享");
        // 用户取消分享后执行的回调函数
    }
    });

    //发送给朋友
    wx.onMenuShareAppMessage({
    title: wc_title, // 分享标题
    desc: wc_content, // 分享描述
    link: wc_link, // 分享链接
    imgUrl: wc_imgurl, // 分享图标
    type: '', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () { 
        // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
        // 用户取消分享后执行的回调函数
    }
    });
  });

