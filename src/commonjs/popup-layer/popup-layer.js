/**
 * Created by Liu.Jun on 2016/11/8.
 * 依赖 jquery ， 淘宝 flexible.js rem 计算
 * 样式模仿 微信小程序样式库
 */

require('./popup-layer.scss');
require('common/animate.css');

let layer = {};

function createTpl(options) {
    console.log(options);
    let tplOptions = {
        mask: options.isShowMask ? `<div class="layer-mask"></div>` : '',
        title: options.title ? `<div class="layer-title"><strong>${options.title}</strong></div>` : '',
        content: options.content ? `<div class="layer-content">${options.content}</div>` : '',
        tools: function (tools) {
            let tempStr = '';
            if(tools && tools.length > 0){
                let styleClass = options.style ==1 ? 'style-border' : 'style-2';
                tempStr += `<div class="layer-tools ${styleClass}">`
                $.each(tools, function (i, v) {
                    tempStr += `<a href="javascript:;" class="j_layerBtn layer-btn ${v.class}">${v.text}</a>`
                });
                tempStr += '</div>'
            }
            return tempStr;
        }(options.tools)
    }
    let tmpHtml = `<div class="popup-layer animated">
                        ${tplOptions.mask}
                        <div class="layer-dialog">
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

layer.msg = function (options) {
    options = $.extend({},defaultOptions,options);
    let tpl = createTpl(options),
        $tpl = $(tpl);

    $tpl.find('.j_layerBtn').each(function (i,v) {
        $(v).on('click',function (event) {
            debugger
            options.tools[i] && options.tools[i].call(this,event);
        });
    });

    $(tpl).addClass('fadeIn').appendTo('body');
}

layer.loading = function () {

}

layer.success = function () {

}

module.exports = layer;