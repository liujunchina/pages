/**
 * Created by Liu.Jun on 2016/11/9.
 */
require('./airport-rotate-list.scss');
import Vue from 'vue';
var app = new Vue({
    el: '#app',
    data: {
        isLoading:false,
        giftList: []
    },
});

function init() {
    $.ajax({
        url: '/airport/Index/mygift.html',
        type: 'post'
    }).done(({errCode, errMsg, obj})=> {
        if(errCode ===0){
            app.giftList = obj;
        }else{
            alert(errMsg);
        }
    }).fail(()=>{
        alert('获取中奖纪录失败');
    }).always(()=>{
        app.isLoading = true;
    })
}

init();
