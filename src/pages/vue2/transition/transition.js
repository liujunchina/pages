import Vue from 'lib/vue2';
require('../test.scss');

new Vue({
    el:'#app',
    data:{
        number:0,
        animatedNumber:0,
    },
    watch:{
        number(newValue, oldValue){
            let vm  = this;
            function animate(time) {
                requestAnimationFrame(animate)
                TWEEN.update(time)
            }

            new TWEEN.Tween({ tweeningNumber: oldValue })
                .easing(TWEEN.Easing.Quadratic.Out)
                .to({ tweeningNumber: newValue }, 500)
                .onUpdate(function () {
                    vm.animatedNumber = this.tweeningNumber.toFixed(0)
                })
                .start()

            animate()
        }
    }
})