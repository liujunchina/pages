/**
 * Created by Liu.Jun on 2016/12/23.
 */

require('./image-processing.scss');

const Imagine = require('commonjs/image/imagine.js');

const elImage = document.querySelectorAll('.j_image')[0];
const elResultImg = document.querySelectorAll('.j_result')[0];

const elmGray = document.getElementById('j_gray');
const elmRed= document.getElementById('j_red');

elmGray.addEventListener('click',function () {
    Imagine.gray(elImage.src).then((canvas) => {
        elResultImg.src = canvas.toDataURL();
    }, (error) => {
        console.error(`出错了${error}`);
    });

    Imagine.gray2(elImage.src).then((canvas) => {
        document.querySelectorAll('.j_result2')[0].src = canvas.toDataURL();
    }, (error) => {
        console.error(`出错了${error}`);
    });

},false);

document.getElementById('j_invert').addEventListener('click',function () {
    Imagine.invert(elImage.src).then((canvas) => {
        document.querySelectorAll('.j_result3')[0].src = canvas.toDataURL();
    }, (error) => {
        console.error(`出错了${error}`);
    });
},false);

elmRed.addEventListener('click',function () {
    Imagine.color(elImage.src).then((canvas) => {
        document.querySelectorAll('.j_result4')[0].src = canvas.toDataURL();
    }, (error) => {
        console.error(`出错了${error}`);
    });
},false);

