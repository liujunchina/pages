/**
 * main.js
 */

(function ($) {
    var styles = document.getElementsByTagName("head")[0].style,
        toCheck = "transformProperty WebkitTransform OTransform msTransform MozTransform".split(" "),
        supportedCSS,
        supportedCSSTransition;
    for (var a = 0; a < toCheck.length; a++) if (styles[toCheck[a]] !== undefined) {
        supportedCSS = toCheck[a];
    }
    if (supportedCSS) {
        supportedCSSTransition = supportedCSS.replace(/[tT]ransform/, "Transition");
        if (supportedCSSTransition[0] == "T") supportedCSSTransition[0] = "t";
    }

    var SimpleRotate = function (opts, elm) {
        this.elm = elm;
        this.setOptions(opts);
        this.setStyle();
        return this;
    };

    SimpleRotate.prototype = {
        timer: null,
        setOptions: function (opts) {
            opts = opts || {};
            opts = $.extend({
                duration: 3000,
                animateTo: 1000,
                callback: false
            }, opts);

            this.config = opts;
        },

        setStyle: function () {
            var self = this;
            this.elm.style[supportedCSS] = "rotate(" + (this.config.animateTo) + "deg)";
            this.elm.style[supportedCSSTransition] = "all " + (this.config.duration / 1000) + "s ease";

            if (this.timer) clearTimeout(this.timer);

            this.timer = setTimeout(function () {
                self._endCall();
            }, self.config.duration);
        },
        _endCall: function () {
            var self = this;
            // 清空样式
            this.elm.style[supportedCSSTransition] = "none";
            this.elm.style[supportedCSS] = "rotate(" + (this.config.animateTo % 360) + "deg)";
            if (self.config.callback) self.config.callback();
        }
    };

    // zepto data 方法不能直接缓存对象 xxxxx
    var cacheKey = 10086;
    var cacheSimpleRotate = [];

    // 简单缓存
    $.fn.simpleRotate = function (opts) {
        return this.each(function () {
            var item = $(this), dataKey = item.data('liuDateKay'), keyValue;
            if (!dataKey) {
                cacheKey++;
                keyValue = 'liu' + cacheKey;
                item.data('liuDateKay', keyValue);
                cacheSimpleRotate[keyValue] = new SimpleRotate(opts, this);
            } else {
                var tmp = cacheSimpleRotate[dataKey];
                tmp.setOptions(opts);
                tmp.setStyle();
            }
        });
    };
})(Zepto);


$(function () {
    var tip = new Base.Widget.Tip();

    window.dialog = new Base.Widget.Dialog({
        'minWidth': '75%',
        mainTmpl: '<div class="ui-dialog-main-container">\
                        <a href="javascript:;" title="关闭" class="j-dialog-closer"><span>×</span></a>\
                        <h3 class="j-dialog-title dialog-title"></h3>\
                        <div class="j-dialog-content dialog-content"></div>\
                        <div class="j-dialog-buttons"></div>\
                    </div>'
    });
    var plate;

    // 添加点击背景关闭弹窗
    dialog.el.on("click", ".ui-mask-container", function () {
        dialog.hide();
    });

    var ProductList = Base.klass.create({
        elements: {
            '.j-wxBottom': 'elFooter',
            '.j-list': 'elList',
            '.j-yao': 'elYao',
            '#j_layer': 'elLayer'
        },
        events: {
            'click .j-invite': 'inviteEvent',
            'click .j-rolLogin': 'rolLoginEvent'
        },
        tpl: {
            item: '<li><div class="item-wrap"><a href="/rebate/item.html#id-<%=pid%>" class="j-rolLogin"><div class="thumbnail"><img class="img" src="<%=logourl%>"><%=tag%></div><div class="details"><p class="title"><%=title%></p><p class="income"><i>单笔收入</i>&nbsp;&nbsp;<span>￥<%=unit_commission_fm%></span></p><p class="txt-group"><span class="price">价格：￥<%=price_fm%></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="share">分享次数：<%=quote_count%></span></p></div></a><a data-img="<%=logourl%>" data-title="<%=name%>" data-pid="<%=pid%>" class="share-btn j-share-btn" href="javascript:;">分享</a></div></li>'
        },
        cgi: {
            data: '/api/product/getProductByIds.jsp',
            getTimestamp: '/api/common/getSystemTime.jsp',
            getUserInfo: '/api/user/getSimpleUserInfo.jsp'
        },
        data: [
            {
                // 2015-21-11 00:00:00 以切换时间点戳做判断 20151021 前
                switchTimestamp: 1410713600000,
                currentGoodsId: [1509161144230018, 1508081543560019, 1511271750440007, 1504041745580039, 1512022310040016, 1512091208170053, 1512111141460044, 1512112136100039, 1512142110380139, 1512081024420031]
            },
            {
                // 2015-12-22 00:00:00 以切换时间点戳做判断
                switchTimestamp: 1450800000000,
                currentGoodsId: [1510212137000050, 1505151657400009, 1512021118210012, 1507311018120010, 1510311550120056, 1512022254440012, 1512041115250023, 1512041118010025, 1512011637230015, 1512102145090012]
            },
            {
                // 2015-12-23 00:00:00 以切换时间点戳做判断
                switchTimestamp: 1450886400000,
                currentGoodsId: [1509181121290008, 1511051314140105, 1512041132450027, 1512111140080043, 1512141748170120, 1512141023060084, 1512141029180086, 1512022336280026, 1512141108460097, 1512141103130096]
            },
            {
                // 2015-12-24 00:00:00 以切换时间点戳做判断
                switchTimestamp: 1450972800000,
                currentGoodsId: [1512091208170053, 1512041343480040, 1512041134140028, 1512141026020085, 1512141033580088, 1512022320380021, 1510312112020014, 1512091127420047, 1512161051430202, 1512152016260190]
            },
            {
                // 2015-12-25 00:00:00 以切换时间点戳做判断
                switchTimestamp: 1451059200000,
                currentGoodsId: [1512091208170053, 1511252024070002, 1512111135000041, 1511261143150013, 1512091151260052, 1512152050190199, 1509150924030007, 1508081543560019, 1509161139550017, 1509161214140022]
            },
            {
                // 2015-12-26 00:00:00 以切换时间点戳做判断
                switchTimestamp: 1451145600000,
                currentGoodsId: [1512091208170053, 1509161205040021, 1512041555240057, 1512041527440049, 1512152045020197, 1510141039020006, 1509161542320024, 1512081115390037, 1512111041180019, 1512141037470089]
            }
        ],
        currentGchan: 0,

        init: function () {
            this.isWeixin = Base.Browser.type === 'weixin' ? 1 : 0;

            this.loadlayer = new Base.Widget.Loadlayer({
                owner: 'body'
            });

            this.loadlayer.show();

            //
            // this.getUserInfo();

            // 渲染当前分享商品
            this.getCurrentTimestamp();

            // 微信显示底部图片
            this.isWeixin && this.elFooter.removeClass("hide");

            // 微信分享
            this.isWeixin && this.setWeixinShare();
        },

        inviteEvent: function (e) {
            if (at) {
                tip.show('返回上一页进入‘我的’菜单邀请好友');
                e.preventDefault();
            }
        },
        rolLoginEvent: function (event) {
            if (at) {
                // APP不操作
            } else if (!productList || productList.currentGchan <= 0) {
                event.preventDefault();
                $(".js-goBtn").trigger("click");
                return false;
            }
        },
        setWeixinShare: function () {
            // 微信内分享设置
            new Base.Widget.WXShare({
                config: {
                    'title': '圣诞有礼，塔客喊你来转运！',
                    'imgUrl': 'http://m.allpyra.com/lp/1512171948030011/img/domeimg/wx.jpg',
                    'desc': '12月22日至28日，塔客分享金字塔商品即可参与大转盘抽奖，大牌礼品免费送！',
                    'link': 'http://m.allpyra.com/lp/1512171948030011/index.html'
                }
            });
        },

        setGChan: function (gChan) {
            this.currentGchan = (gChan && gChan != 'null') ? gChan : 0;

            $('.-mob-share-ui').attr('data-gchan', this.currentGchan);

            (this.currentGchan > 0) && this.elYao.removeClass("hide");
        },

        getCurrentTimestamp: function () {
            var params = {
                '_': (new Date()).getTime()
            };
            $.get(this.cgi.getTimestamp, params, this.proxy(this._getCurrentTimestampCall));
        },
        _getCurrentActiveOptions: function (currentTimestamp) {
            var returnData = {
                    isLast: false,
                    isEnd: false,
                    currentGoodsId: []
                },
                dataLength = this.data.length,
                syTimestamp = 0;     // 当前时间戳和当前节点的差

            for (var i = dataLength; i > 0; i--) {
                var o = this.data[i - 1];
                if (currentTimestamp >= o.switchTimestamp) {
                    syTimestamp = currentTimestamp - o.switchTimestamp;
                    if (i == dataLength) {
                        returnData.isLast = true;
                        // 活动结束
                        if (syTimestamp >= (24 * 60 * 60 * 1000)) {
                            returnData.isEnd = true;
                        }
                    }
                    returnData.currentGoodsId = o.currentGoodsId;   // 设置当前产品数据
                    break;
                }
            }
            return returnData;
        },
        _getCurrentTimestampCall: function (result) {
            var currentTimestamp = (result && result.errCode === 0) ? result.obj : (new Date()).getTime();
            this.renderActive(this._getCurrentActiveOptions(currentTimestamp));
        },

        // 渲染当前产品
        _renderCurrentGoods: function (result) {
            var list,
                tmpl,
                tpl,
                coverPrice,
                $list,
                reHtml = '';

            if (result && +result.errCode === 0) {
                list = result.obj;
                tmpl = this.tmpl;
                tpl = this.tpl;
                coverPrice = this.coverPrice;
                $list = this.elList;
                $list.html('');

                if (list && list.length > 0) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        var itemVals = list[i];
                        itemVals.tag = itemVals.tags && itemVals.tags.length > 0 && itemVals.tags[0].pictureUrl ? '<img class="tag" src="' + itemVals.tags[0].pictureUrl + '" alt="' + itemVals.tags[0].name + '">' : '';
                        itemVals.price_fm = coverPrice(itemVals.price);
                        itemVals.title = (itemVals.subtitle_v2 && itemVals.subtitle_v2 != '') ? itemVals.subtitle_v2 : itemVals.name;

                        // 暂时没数据
                        itemVals.quote_count = (itemVals.quote_count == undefined) ? '25' : itemVals.quote_count;
                        itemVals.unit_commission_fm = (itemVals.commission == undefined) ? coverPrice(2500) : coverPrice(itemVals.commission);

                        reHtml += tmpl(tpl.item, itemVals);
                    }

                    // 设置 gchan
                    this.setGChan(list[0].g_chan);

                    $list.html('<ul class="goods-list">' + reHtml + '</ul>');
                } else {
                    $list.html('<li class="empty">暂无数据</li>');
                }
            } else {
                $list.html('<li class="empty">暂无数据</li>');
            }
            this.loadlayer.hide();
        },

        renderActive: function (options) {
            if (options && options.currentGoodsId) {
                // 渲染当前 产品
                if (options.currentGoodsId.length > 0) {
                    $.get(this.cgi.data, {
                        pids: options.currentGoodsId.join(','),
                        _: new Date - 0
                    }, this.proxy(this._renderCurrentGoods, this));
                } else {
                    // 没有产品
                    this.elList.html('<li class="empty">暂无数据</li>');
                }
            }

            if (!options || options.isEnd) {
                this.elLayer.removeClass("hide");
            }
        }
    });

    var Plate = Base.klass.create({
        elements: {
            '.js-chanceNum': 'elChanceNum',
            '.j-winning-record': 'elWinningRecord',
            '.j-plate': 'elPlate'
        },
        events: {
            'click .j-show-rule': 'showRuleEvent',
            'click .js-goBtn': 'playPlateEvent'
        },
        cgi: {
            getChanceNumUri: '/api/lottery/lotteryTimes.jsp?op=1', // 剩余次数
            lotteryUri: '/api/lottery/drawLottery.jsp?op=2',   // 转盘
            getWinningRecordUri: '/api/lottery/queryPrizeLog.jsp?op=3' // 中奖纪录
        },
        openDialog: function (title, content) {
            (title != '') && dialog.html(content, {
                title: title
            });
        },
        tpl: {
            record: '<tr>\
                <td style="max-width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><%=account%></td>\
                <td><%=time%></td>\
                <td style="max-width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><%=title%></td>\
            </tr>'
        },
        getPlateData: function (pzid) {
            var angle = 0, baseDeg = 36;
            switch (pzid - 0) {
                case 100001 :
                    // 5元优惠券
                    angle = 360;
                    break;

                case 100002 :
                    // 1元红包
                    angle = 360 - baseDeg;
                    break;

                case 100003 :
                    // 麦迪安牙膏三支
                    angle = 360 - baseDeg * 2;
                    break;

                case 100004 :
                    // 2元红包
                    angle = 360 - baseDeg * 3;
                    break;

                case 100005 :
                    // 爱茉莉洗发套装
                    angle = 360 - baseDeg * 4;
                    break;

                case 100006 :
                    // 5元红包
                    angle = 360 - baseDeg * 5;
                    break;

                case 100007 :
                    // 虎牌保温杯
                    angle = 360 - baseDeg * 6;
                    break;

                case 100008 :
                    // 15元优惠券
                    angle = 360 - baseDeg * 7;
                    break;

                case 100009 :
                    // 谢谢参与
                    angle = 360 - baseDeg * 8;
                    break;

                case 100010 :
                    // 新秀丽拉杆箱
                    angle = 360 - baseDeg * 9;
                    break;

                default :
                    //
                    alert("非法信息");
                    return false;
                    break;
            }
            return {
                animateTo: angle + 1080
            }
        },
        maxRecord: 8,               // 最多显示中奖纪录条数
        cacheCurrentRecore: [],     // 缓存当前显示纪录
        isRequesting: false,        // 标示当前抽奖状态
        cacheCurrentResult: null,   // 简单缓存当前抽奖结果 {"pzid": "100001", "fee": "120", "title": "1元红包", "type": "1", "lotterytimes": 3, "logourl": ""}


        playPlate: function (pzid, callBack) {
            var duration = 3000,
                obj = this.getPlateData(pzid);  // 获取指针角度

            this.elPlate.simpleRotate($.extend({
                angle: 0,
                duration: duration,
                callback: callBack
            }, obj));

            // 移动端不够流畅
            //this.elPlate.rotate($.extend({
            //    angle:0,
            //    duration: duration,
            //    callback:callBack
            //},obj));
        },

        getPopContent: function () {
            var reObj = {
                    title: '抽奖结果'
                },
                data;
            if (this.cacheCurrentResult) {
                data = this.cacheCurrentResult;

                switch (data.type - 0) {
                    case 1 :
                        // 实物商品
                        reObj.content = '<div class="result-wrap goods-wrap">\
                                        <p class="r-title">恭喜您抽中商品</p>\
                                        <p class="img">\
                                            <img src="' + data.logourl + '" alt="' + data.title + '"/>\
                                        </p>\
                                        <p class="title">' + data.title + '</p>\
                                        <p class="info">金字塔客服将在1个工作日内联系您，请耐心等待!</p>\
                                        </div>';
                        break;
                    case 2 :
                        // 红包
                        reObj.content = '<div class="result-wrap hb-wrap">\
                                        <p class="r-title">恭喜您抽中红包</p>\
                                        <p class="title"><span class="hb">' + this.coverPrice(data.fee) + '</span>元</p>\
                                        <p class="info">已存入账户余额</p>\
                                        </div>';
                        break;

                    case 3 :
                        // 优惠券
                        reObj.content = '<div class="result-wrap coupon-wrap">\
                                        <p class="r-title">恭喜您抽中<span class="num">' + Math.floor(data.fee / 100) + '</span>元优惠券</p>\
                                        <p class="img">\
                                            <img src="' + data.logourl + '" alt="' + data.title + '"/>\
                                        </p>\
                                        <p class="info">已发放到个人中心</p>\
                                        </div>';
                        break;

                    case 100 :
                        // 谢谢惠顾
                        reObj.content = '<div class="result-wrap thx-wrap">\
                                            <p class="r-title">谢谢参与</p>\
                                        </div>';
                        break;
                    default  :
                        break;
                }
            }
            return reObj;
        },
        _playPlateEndCall: function () {
            // 提示中奖信息
            var popObj = this.getPopContent();
            popObj.content != undefined && this.openDialog(popObj.title, popObj.content);

            // 刷新中奖纪录
            this.getWinningRecord();

            this.isRequesting = false;  // 结束后可以下一次操作
        },

        _getPlateResultCall: function (result) {
            // liu debug
            //result = {
            //    "obj": {
            //        "pzid": "100008",
            //        "fee": "120",
            //        "title": "虎牌保温杯",
            //        "type": "1",
            //        "lotterytimes": 22,
            //        "logourl": "http://m.allpyra.com/lp/1512171948030011/img/domeimg/goods.jpg"
            //    },
            //    "errCode": 0,
            //    "errMsg": ""
            //};

            var data;
            if (result) {
                if (result.errCode === 0) {
                    data = this.cacheCurrentResult = result.obj;

                    // 设置当前次数
                    this.setChanceNum(data.lotterytimes);

                    // 计算转盘角度位置
                    this.playPlate(data.pzid, this.proxy(this._playPlateEndCall));
                } else {
                    // 没机会了
                    this.openDialog('温馨提示', '<div class="result-wrap coupon-wrap">\
                                        <p class="img">\
                                            <img src="http://m.allpyra.com/lp/1512171948030011/img/domeimg/orr.png" alt=""/>\
                                        </p>\
                                        <p class="info">您的抽奖次数不足！<br/>去分享才能继续抽奖哦！</p>\
                                        <p class="other"><a href="#go-share" onclick="dialog.hide();">去分享</a></p>\
                                        </div>');

                    this.isRequesting = false;
                }
            } else {
                alert('请求失败');
            }
        },
        playPlateEvent: function () {
            if (this.isRequesting) return false;

            // debug
            //this.isRequesting = true;
            //$.post(this.cgi.lotteryUri, {'_':(new Date()).getTime()}, this.proxy(this._getPlateResultCall));
            //return;

            if (productList && productList.currentGchan > 0) {
                //
                this.isRequesting = true;   // 转盘操作中
                $.post(this.cgi.lotteryUri, {'_': (new Date()).getTime()}, this.proxy(this._getPlateResultCall));
            } else {
                // 非塔客
                this.openDialog('温馨提示', '<div class="result-wrap other-wrap">\
                                        <p class="img">\
                                            <img src="http://m.allpyra.com/lp/1512171948030011/img/domeimg/orr.png" alt=""/>\
                                        </p>\
                                        <p class="other">亲，登录后才可以参与活动哦<br/>\
                                        <a href="/rebate/guide.html?g_chan=lilin" class="' + ((at) ? 'hide' : '') + '">注册</a>&nbsp;&nbsp;\
                                        <a href="/rebate/login.html?sourceurl=/lp/1512171948030011/index.html">登录</a></p>\
                                        </div>');
            }
        },
        init: function () {
            // 获取中奖次数
            // this.getChanceNum();

            // 获取中奖历史纪录
            this.getWinningRecord();
        },

        // 抽奖次数
        getChanceNum: function () {
            $.post(this.cgi.getChanceNumUri, {'_': (new Date()).getTime()}, this.proxy(this._getChanceNumCall));
        },
        _getChanceNumCall: function (result) {
            (result && result.errCode === 0) && this.setChanceNum(result.obj.lotterytimes);
        },

        //历史纪录
        getWinningRecord: function () {
            $.get(this.cgi.getWinningRecordUri, {
                '_': (new Date()).getTime(),
                pageSize: 20,
                pageNo: 1
            }, this.proxy(this._getWinningRecordCall));
        },
        _getWinningRecordCall: function (result) {
            if (result && result.errCode === 0) {
                this.addRecord(result.obj.list);
            } else {
                //  xxx
            }
        },
        // 计划用于追加纪录，实际并没有用
        addRecord: function (dataList) {
            var listLength,
                reHtml = '';
            listLength = dataList.length;
            if (listLength > 0) {
                for (var i = 0; i < listLength && i < this.maxRecord; i++) {
                    //this.cacheCurrentRecore.unshift(this.tmpl(this.tpl.record, $.extend({
                    //    time : this.formatTime(dataList[i].prize_time || 0,'H:m:s')
                    //},dataList[i])));
                    reHtml += this.tmpl(this.tpl.record, $.extend({
                        time: this.formatTime(dataList[i].prizeTime || 0, 'H:m:s')
                    }, dataList[i]));
                }
                //this.cacheCurrentRecore.splice(this.maxRecord);
                //reHtml = this.cacheCurrentRecore.join('');
            } else {
                reHtml = '<tr><td>没有纪录</td></tr>';
                // 没有纪录
            }
            this.elWinningRecord[0].innerHTML = reHtml;
        },
        setChanceNum: function (num) {
            this.elChanceNum.text(num || 0);
        },
        showRuleEvent: function (e) {
            var title = '活动详细规则',
                content = '<div class="rule">\
                    <p>1、活动时间： 12月22日10:30——12月28日24:00</p>\
                    <p>2、活动形式：塔客每分享一次商品即可获得一次抽奖机会（仅限当天使用）；一天内抽奖次数不限；</p>\
                    <p>3、用户邀请好友注册塔客成功(一人及以上）当天中奖概率翻倍；</p>\
                    <p>4、每天同款商品分享到同一渠道只增加一次抽奖机会；</p>\
                    <p><b class="sub-title">关于奖品</b></p>\
                    <p>1、商品奖品：价值59元、75元、249元、1990元金字塔海外商品；幸运用户抽中奖品由金字塔客服联系本人寄送；中奖以后请保持您的手机畅通；</p>\
                    <p>2、实物奖品由金字塔商城提供，详细商品信息可在金字塔App商城中查询；</p>\
                    <p>3、优惠券：用户抽中优惠券奖品，系统将派发到个人中心，可用于金字塔App商城购物时抵扣；</p>\
                    <p>4、红包：用户抽中红包奖品，系统将自动存入塔客佣金余额中，满25可提现；</p>\
                </div>';
            this.openDialog(title, content);
        }
    });


    // 产品分享相关操作
    window.productList = new ProductList();

    // 转盘相关操作
    new Plate({
        el: '.j-container'
    });
});

