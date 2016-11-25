import Vue from 'lib/vue2';
require('../test.scss')

// 数据绑定

Vue.component('todo-item',{
    props:['item'],
    template:'<li>{{item.name}}</li>'
})

let vm = new Vue({
    el: '#app',
    data: {
        message: '这里是 messages',
        say: '再也不骗了',
        list: [{
            name: 'lll'
        }, {
            name: 'xxx'
        }],
        xxx: 'red',
        color: false,
        styleObj: {
            fontSize: '30px',
            color:'#ddd'
        },
        styleObj2: {
            color:'green'
        },
        boolVal:false,
        counter:0,
        checked:true,
        checkedNames:[],
        radioNames:'',
        selected:[]
    },
    methods: {
        reverseMessage(){
            this.say = [...this.say].reverse().join('')
        },
        pushList(){
            this.list.push({
                name: Math.ceil(Math.random() * 8000)
            })
        },
        reversedMessageFn(){
            return [...this.say].reverse().join('')
        }
    },
    computed: {
        reversedMessage: function () {
            return [...this.say].reverse().join('')
        }
    }
});

vm.$watch('message', function (newData, oldData) {
    console.log(`newData ${newData},oldData ${oldData}`)
    console.log(this);
});

setTimeout(()=>{
    vm.color=true;
    vm.xxx = 'green';
    vm.boolVal = true;
},1000)

window.vm = vm;


let app2 = new Vue({
    el: '#app2',
    data: {
        isShow: false,
    },
    methods: {
        onToggle(){
            this.isShow = !this.isShow
        }
    }
})


