/**
 * Created by Liu.Jun on 2016/12/8.
 * 依赖 jquery ， 淘宝 flexible.js rem 计算
 * 样式模仿 微信小程序样式库
 */

require('./popup-layer.scss');
require('common/animate.css');

let layer = {};

function createTpl(options) {
    let tplOptions = {
        inlineStyle: options.inlineStyle ? `style=${options.inlineStyle}` : '',
        mask: options.isShowMask ? `<div class="layer-mask"></div>` : '',
        title: options.title ? `<div class="layer-title"><strong>${options.title}</strong></div>` : '',
        content: options.content ? `<div class="layer-content">${options.content}</div>` : '',
        tools: function (tools) {
            let tempStr = '';
            if(tools && tools.length > 0){
                tempStr += `<div class="layer-tools">`;
                tools.forEach((v,i) => {
                    tempStr += `<a href="javascript:;" data-index="${i}" class="j_layerBtn layer-btn ${v.class}">${v.text}</a>`
                });
                tempStr += '</div>'
            }
            return tempStr;
        }(options.tools)
    }

    let styleClass = '';
    switch (options.style - 0){
        case 1:
            styleClass = 'style-border';
            break;
        case 2:
            styleClass = 'style-2';
            break;
        case 20:
            // loading
            styleClass = 'style-loading';
            break;
        case 21:
            // loading
            styleClass = 'style-success';
            break;

        case 30:
            // 弹出窗口
            styleClass = 'style-layer'
            break;

        default:
            break;
    }
    let tmpHtml = `<div class="popup-layer animated ${styleClass}">
                        ${tplOptions.mask}
                        <div class="layer-dialog" ${tplOptions.inlineStyle}>
                            ${tplOptions.title}
                            ${tplOptions.content}
                            ${tplOptions.tools}
                        </div>
                    </div>`;
    return tmpHtml;
}

let defaultOptions = {
    isShowMask: true,       // 是否显示遮盖
    title:'',               // 标题 不是必须
    content:'',             // 内容 可以是html
    onClose:false,          // 关闭的回调
    style: 1,               // 1 或者 2 （加borde 和 不加border）
    tools:[                 // 按钮配置
        {
            class: 'layer-btn-primary',
            text: '确定',
            onClick:false
        }
    ]
}

function removeMsg($msg,callBack) {
    $msg.addClass('fadeOut');
    setTimeout(()=>{
        $msg.remove();
        callBack && callBack();
    },300)
}

function showMsg($tpl) {
    $tpl.addClass('fadeIn').appendTo('body');
}

layer.msg = function (options) {
    options = $.extend({},defaultOptions,options);
    let tpl = createTpl(options),
        $tpl = $(tpl);
    $tpl.addClass('fadeIn').appendTo('body');
    $tpl.find('.j_layerBtn').on('click',function () {
        let index = $(this).data('index');
        removeMsg($tpl,options.onClose);
        options.tools[index]['onClick'] && options.tools[index]['onClick'].call(this,event);
    });
}

layer.loading = function (options) {
    if(this.$loading) return false;

    options = $.extend({
        isShowMask: false,
        content:'加载中..'
    },options,{
        title:'',
        tools:[],
        style:20,
        onClose:false,
    })

    let content = `<div class="load-spinner">
                        <div class="spinner-container container1">
                            <div class="circle1"></div>
                            <div class="circle2"></div>
                            <div class="circle3"></div>
                            <div class="circle4"></div>
                        </div>
                        <div class="spinner-container container2">
                            <div class="circle1"></div>
                            <div class="circle2"></div>
                            <div class="circle3"></div>
                            <div class="circle4"></div>
                        </div>
                        <div class="spinner-container container3">
                            <div class="circle1"></div>
                            <div class="circle2"></div>
                            <div class="circle3"></div>
                            <div class="circle4"></div>
                        </div>
                    </div>`;
    let toastContent = options.content ? `<p class="toast-content">${options.content}</p>` : '';
    options.content = `${content}${toastContent}`;

    let tpl = createTpl(options);
    this.$loading = $(tpl)
    showMsg(this.$loading);
};

layer.unLoading = function () {
    if(this.$loading){
        this.$loading.remove();
        delete this.$loading
    }
}

layer.layer = function (options) {
    options = $.extend({
        inlineStyle:'width:90%;',
    },options,{
        tools:[],
        style:30,
        isShowMask: true
    })
    let $tpl = $(createTpl(options));
    $tpl.find('.layer-mask').on('click',function () {
        $tpl.remove();
    });
    showMsg($tpl);
};

module.exports = layer;