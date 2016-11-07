/**
 * Created by Liu.Jun on 2016/11/6.
 */

require('./rotate.scss');
require('commonjs/simpleRotate.jquery.js');

import Vue from 'vue';
import wxShare from 'commonjs/wx-share.js';

var app = new Vue({
    el: '#app',
    data(){
        return {

        }
    },
    methods:{
        onPlay(event){
            if(this.isRequesting) return false;
            this.isRequesting = true;
            $.ajax({
                url:'/fasdf',
                type:'post'
            }).done(function () {
                debugger
            }).always(()=>{
                let baseDeg = 45;
                let roData = [];
                for(let i = 0; i<9; i++){
                    roData.push(360 - baseDeg * i);
                }

                $(this.$els.plate).simpleRotate({
                    duration: 5000,
                    animateTo: roData[Math.floor(Math.random() * roData.length)] + 3600,
                    callback: ()=>{
                        this.isRequesting = false;
                    }
                });
            });
        }
    }
});

// 设置微信分享
wxShare({
    'imgUrl': window.location.origin + '/xxxxxx.jpg',
    'link': window.location.href,
    'desc': 'xxxxxx',
    'title': 'xxxxxxxxxxxxxxxxxx',
})


