import Vue from 'lib/vue2';
require('../test.scss');

Vue.component('v-test',{
    props:{
        messages:{
            type:String,
            default:'my default Value'
        },
        updateList:{
            type: Function,
        }
    },
    template:`<div><div>messages:{{messages}}</div><div>组件title</div><div><button @click="counter+=1">{{counter}}</button></div></div>`,
    data:()=>{
       return {
            counter:0
        }
    },
    mounted(){
        setTimeout(()=>{
            this.$emit('updatelist',[
                'jun',
                'liu',
                '2016'
            ]);
            this.$emit('testModel','子组件更新')
        },1000)
    }
});



window.vm = new Vue({
    el: '#app',
    data: {
        counter: 0,
        messages: 'xxx',
        list: ['jun', 'liujun'],
        testModel:'父组件默认值'
    },

    methods: {
        updateList(list){
            this.list = list;
        },
    },
    computed: {}
});

Vue.component('test-model',{
    template:`<div>{{name}}</div>`,
    props:{
        name:{
            type:String,
            default:'xxxxxxxxxxxxxxxxx'
        },
        value: {
            type: Array,
            default: 0
        }
    },
    mounted(){
        setTimeout(()=>{
            this.$emit('input', ['ddd','xxxx'])
        },2000)
    }
})

window.vm2 = new Vue({
    el:'#app2',
    data:{
        list:['list','list']
    }

})