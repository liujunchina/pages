/**
 * Created by Liu.Jun on 2016/11/7.
 */

let wxConfig = require('./wx-config');

module.exports = function (shareConfig,useCacheToken = true) {
    let defaultConfig = {
        'imgUrl': window.location.origin + '/share.jpg',
        'link': window.location.href,
        'desc': '请设置分享描述',
        'title': '请设置分享标题',
        'type': '', // 分享类型,music、video或link，不填默认为link
        'dataUrl': '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    };
    shareConfig = $.extend({},defaultConfig,shareConfig);

    wxConfig((token)=>{
        wx.ready(function(){
            // 分享给朋友
            wx.onMenuShareAppMessage(shareConfig);

            // 分享给朋友圈
            wx.onMenuShareTimeline(shareConfig);

            // 分享到qq
            wx.onMenuShareQQ(shareConfig);

            // 分享到微博
            wx.onMenuShareWeibo(shareConfig);

            // 分享到qq空间
            wx.onMenuShareQZone(shareConfig);
        });

        wx.error(function(res){
            // nothing
        });

    }, useCacheToken);
};