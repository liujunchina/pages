/**
 * Created by Liu.Jun on 2016/11/29.
 */
import Vue from 'lib/vue2';
require('../test.scss');

Vue.directive('focus',{
    bind:function () {

    },
    inserted: function (el) {
        // 聚焦元素
        el.focus()
    },
    update:function () {

    },
    componentUpdated:function () {
        
    },
    unbind:function () {

    }
});

new Vue({
    el:'#app',
    data:{
        number:'0'
    }
})