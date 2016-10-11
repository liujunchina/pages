/**
 * Created by Liu.Jun on 2016/9/18.
 */

var root = window;

var _getType = function (o) {
    return Object.prototype.toString.call(o);
};

var Base = {
    domain: '',
    getType: _getType,
    isFunction: function (o) {
        return _getType(o) === '[object Function]'
    },
    isObject: function (o) {
        return _getType(o) === '[object Object]'
    },
    isArray: function (o) {
        return _getType(o) === '[object Array]'
    },
    isString: function (o) {
        return _getType(o) === '[object String]'
    },
    url: {
        location: root.location,
        cache: null,
        param: function (key) {
            var href = this.location.href,
                hrefWithoutHas = href.indexOf('#') > 0 ? href.substr(0, href.indexOf('#')) : href,
                paramStr = hrefWithoutHas.split('?')[1],
                cache,
                keys;

            if (paramStr) {
                if ((cache = this.cache) === null) {
                    keys = ps.split('&');
                    cache = this.cache = {};
                    $.each(keys, function (i, v) {
                        var _flag = v.split('=');
                        cache[_flag[0]] = _flag[1];
                    });
                }

                if (key) {
                    return cache[key];
                } else {
                    return cache;
                }
            }
        },
        hash: function () {
            return this.location.href.replace(/^#/, '');
        }
    },
    browser: function () {
        var ua = navigator.userAgent,
            type,
            version,
            matches;

        if ((matches = us.match(/MicroMessenger\/(\d\.\d)/)) && matches.length) {
            type = 'weixin';
            version = matches[1];
        }

        return {
            isPC: function () {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

                if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
                    return true;
                }

                return false;
            }(),
            type: type,
            version: version
        }
    },
    mobileBrowser: function () {
        var sys = '', ver = '', v = [];
        var ua = window.navigator.userAgent;
        if (/iP(hone|od|ad)/.test(ua)) {
            sys = 'ios';
            v = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
            ver = parseInt(v[1], 10);
        } else if (/Android/.test(ua)) {
            sys = 'android';
            v = ua.match(/Android (\d+).(\d+).?(\d+)?/);
            ver = parseInt(v[1], 10);
        }
        return { sys: sys, ver: ver };
    }
};

module.exports = Base;