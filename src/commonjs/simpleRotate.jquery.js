(function ($) {
    var styles=document.getElementsByTagName("head")[0].style,
        toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" "),
        supportedCSS,
        supportedCSSTransition;
    for (var a = 0; a < toCheck.length; a++) if (styles[toCheck[a]] !== undefined) { supportedCSS = toCheck[a]; }
    if (supportedCSS) {
        supportedCSSTransition = supportedCSS.replace(/[tT]ransform/,"Transition");
        if (supportedCSSTransition[0] == "T") supportedCSSTransition[0] = "t";
    }

    var SimpleRotate = function (opts,elm) {
        this.elm = elm;
        this.setOptions(opts);
        this.setStyle();
        return this;
    };

    SimpleRotate.prototype = {
        timer : null,
        setOptions : function (opts) {
            opts = opts || {};
            opts = $.extend({
                duration: 3000,
                animateTo: 1000,
                callback: false
            },opts);

            this.config = opts;
        },

        setStyle : function(){
            var self = this;
            this.elm.style[supportedCSS]= "translateZ(0) rotate("+(this.config.animateTo)+"deg)";
            this.elm.style[supportedCSSTransition] = "all " +(this.config.duration / 1000)+ "s ease";

            if (this.timer) clearTimeout(this.timer);

            this.timer = setTimeout(function () {
                self._endCall();
            },self.config.duration);
        },
        _endCall : function(){
            var self = this;
            // 清空样式
            this.elm.style[supportedCSSTransition] = "none";
            this.elm.style[supportedCSS]= "translateZ(0) rotate("+(this.config.animateTo%360)+"deg)";
            if(self.config.callback) self.config.callback();
        }
    };

    // zepto data 方法不能直接缓存对象 xxxxx
    var cacheKey = 10086;
    var cacheSimpleRotate = {};

    // 简单缓存
    $.fn.simpleRotate = function (opts) {
        return this.each(function () {
            var item = $(this), dataKey = item.data('liuDateKay'),keyValue;
            if(!dataKey) {
                cacheKey ++ ;
                keyValue = 'liu' + cacheKey;
                item.data('liuDateKay',keyValue);
                cacheSimpleRotate[keyValue] = new SimpleRotate(opts,this);
            } else {
                var tmp = cacheSimpleRotate[dataKey];
                tmp.setOptions(opts);
                tmp.setStyle();
            }
        });
    };
})(jQuery);