/**
 * Created by Liu.Jun on 2016/11/6.
 */

require('./rotate.scss');
require('commonjs/simpleRotate.jquery.js');

import Vue from 'vue';
import wxShare from 'commonjs/wx-share.js';

var app = new Vue({
    el: '#app',
    data:{
        isShowGift:false,      // 显示中奖结果图片
        giftImg:''
    },
    methods:{
        _getRotateAngle(lotteryId){
            let baseDeg = 45;
            let angle = 0;
            switch (lotteryId - 0){
                case 1:
                    // 酒店预订、旅游 20元
                    angle = 360 + baseDeg * 7;
                    break;

                case 2:
                    // shopping购 20元
                    angle = 360 + baseDeg * 6;
                    break;

                case 3:
                    // 行李打包 酒店预订 旅游 10员
                    angle = 360 + baseDeg * 5;
                    break;

                case 4:
                    // 洗车优惠券
                    angle = 360 + baseDeg * 4;
                    break;

                case 5:
                    // wifi 租赁 40元
                    angle = 360 + baseDeg * 3;
                    break;

                case 6:
                    // cip专用通道 优惠超值服务
                    angle = 360 + baseDeg * 2;
                    break;

                case 7:
                    // 电信充值卡 100元
                    angle = 360 + baseDeg;
                    break;

                case 8:
                    // 1000 元现金
                    angle = 360;
                    break;
            }

            return angle + 1440;
        },
        onPlay(event){
            if(this.isRequesting) return false;
            this.isRequesting = true;
            $.ajax({
                url:'/airport/Index/lottery.html',
                type:'post'
            }).done(({errCode,errMsg,obj})=>{
                if(errCode === 0){
                    let angle = this._getRotateAngle(obj.lotteryId);
                    $(this.$els.plate).simpleRotate({
                        duration: 3000,
                        // animateTo: roData[Math.floor(Math.random() * roData.length)] + 3600,
                        animateTo: angle,
                        callback: ()=>{
                            this.isRequesting = false;
                            // alert(obj.name);

                            this.giftImg = obj.img;
                            this.isShowGift = true;
                        }
                    });
                }else{
                    this.isRequesting = false;
                    alert(errMsg);
                }
            }).fail(()=>{
                this.isRequesting = false;
                alert('抽奖失败，请重试');
            });
        },
        hideGift(){
            this.isShowGift = false;
        }
    }
});

// 设置微信分享
wxShare({
    'imgUrl': require('./imgs/plate-none.png'),
    'link': window.location.href,
    'desc': 'xxxxxx',
    'title': 'xxxxxxxxxxxxxxxxxx',
})


