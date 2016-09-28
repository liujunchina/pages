<?php
	include "./WeixinJsSdk.class.php";
	$jssdk = new JSSDK('wx02ac9ee3fc9854fc', '9e61b9e28a631042bdda3706ae1db053 ');
	$signPackage = $jssdk->GetSignPackage();
	
?>



<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东门中心城味爱行走</title>
    <meta name="description" content=""/>
    <!-- 让IE浏览器用最高级内核渲染页面 还有用 Chrome 框架的页面用webkit 内核 -->
    <meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
    <!-- IOS6全屏 Chrome高版本全屏-->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <!-- webkit内核渲染页面-->
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="format-detection" content="telephone=no">
    <!--css -->
    <link rel="stylesheet" href="css/swiper.min.css"  media="all" type="text/css" />
    <link href="css/animate.min.css" media="all" rel="stylesheet" type="text/css" />
    <link href="css/style.css?03" media="all" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="css/my.css?03" media="all" type="text/css">
</head>
<body>
    <div id="preloader" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; display: block; z-index: 99999; background-color: #353535; color: #FFF;">
        <div style="display: table;width: 100%;height: 100%;">
            <div style="display: table-cell;vertical-align:middle;text-align: center;">
                加载中...
            </div>
        </div>
    </div>
    <div class="swiper-container">
        <div class="swiper-wrapper" id="j_wrapper">
            <div class="swiper-slide section blue-slide">
                <div class="my-content">
                    <div class="in-bg first-bg bg-position-top-center bg-repeat-no bg-size-cover" style="background-image: url(images/slider1/slide1.jpg);">
                        <div class="font-text" style="width: 78%; top: 12%; left: 11%;">
                            <img src="./images/slider1/text.png" alt="">
                        </div>
                        <div class="font-text" style="width: 13%; top: 10%; right: 5%;">
                            <img src="./images/slider1/one.png" alt="">
                        </div>
                        <div class="font-text" style="width: 79%; bottom: 0; left: 10%;">
                            <img src="./images/slider1/img.png" alt="">
                        </div>
                    </div>
                </div>
            </div>

            <div class="swiper-slide section red-slide">
                <div class="my-content">
                    <div class="in-bg first-bg bg-position-top-center bg-repeat-no bg-size-cover" style="background-image: url(images/slider1/slide1.jpg);">
                        <div class="font-text" style="width: 82%; bottom: 5%; left: 7%;">
                            <img src="./images/slider2/text.png" alt="">
                        </div>
                        <div class="font-text" style="width: 13%; bottom: 6%; left: 5%;">
                            <img src="./images/slider1/one.png" alt="">
                        </div>
                        <div class="font-text" style="width: 77%; top: 10%; left: 11%;">
                            <img src="./images/slider2/img.png" alt="">
                        </div>
                    </div>
                </div>
            </div>

            <div class="swiper-slide section orange-slide">
                <div class="my-content">
                    <div class="in-bg first-bg bg-position-top-center bg-repeat-no bg-size-cover" style="background-image: url(images/slider1/slide1.jpg);">
                        <div class="font-text" style="width: 75%; bottom: 5%; left: 12%;">
                            <img src="./images/slider3/text.png" alt="">
                        </div>
                        <div class="font-text" style="width: 13%; top: 10%; left: 5%;">
                            <img src="./images/slider1/one.png" alt="">
                        </div>
                        <div class="font-text" style="width: 63%; top: 10%; left: 23%;">
                            <img src="./images/slider3/img.png" alt="">
                        </div>
                    </div>
                </div>
            </div>

            <div class="swiper-slide section orange-slide">
                <div class="my-content">
                    <div class="in-bg first-bg bg-position-top-center bg-repeat-no bg-size-cover" style="background-image: url(images/slider1/slide1.jpg);">
                        <div class="font-text" style="width: 79%; top: 11%; left: 12%;">
                            <img src="./images/slider4/text.png" alt="">
                        </div>
                        <div class="font-text" style="width: 13%; right: 6%; bottom: 5%;">
                            <img src="./images/slider1/one.png" alt="">
                        </div>
                        <div class="font-text" style="width: 74%; bottom: 6%; left: 13%;">
                            <img src="./images/slider4/img.png" alt="">
                        </div>
                    </div>
                </div>
            </div>

            <div class="j_swiperScroll swiper-slide section orange-slide" style="overflow: auto; height: 545px; background-image: url(images/slider5/bg.jpg); background-size: cover; background-position: 50% 0; background-repeat: no-repeat;">
                <div class="my-content">
                    <div class="in-bg first-bg">
                        <form id='j_uploadForm' action='upload.php' method='post' enctype='multipart/form-data'>
                            <div class="font-text" style="position: relative; width: 94%; padding-top: 5%; margin: 0 auto;">
                                <div id="j_imgWrap" class="oh img-wrap">
                                    <img src="./images/slider5/card.jpg" alt="">
                                </div>
                                <div id="j_upload" class="font-text" style="width: 32%; top: 36%; left: 8%;">
                                    <img src="./images/slider5/upload.jpg" alt="">
                                </div>
                                <input type="file" name="upfile" id="j_outerstore" style="display:none;" />
                                <input type="hidden" name="gsp_pic" value="">
                                <div class="pre-img tip-img font-text" id="j_imgTip">
                                    <div class="tip-content">
                                        <p class="txt">长按此处保存图片</p>
                                    </div>
                                </div>
                            </div>
                            <div style="position: relative; width: 94%; margin: 3% auto 0;">
                                <div id="j_save" class="font-text" style="top: 0;right: 0; width: 46%; position: absolute;">
                                    <img src="./images/slider5/save.png" alt="">
                                </div>
                                <div id="j_reset" class="font-text" style="width: 46%; position: relative;">
                                    <img src="./images/slider5/reselect.png" alt="">
                                </div>
                            </div>
                        </form>
                        <div class="j_txtContent" style="position: relative; width: 94%; margin: 3% auto 0; background-color: rgba(255,255,255,0.6); padding: 15px 20px; box-sizing: border-box;">
                            <div class="font-text" style="width: 33%; position: relative; margin: 0 auto;">
                                <img src="./images/slider5/rule.png" alt="">
                            </div>
                            <div class="rule-txt" style="margin-top: 10px;font-size: 12px; line-height: 19px">
                                <p style="padding: 2px 0;letter-spacing: 0.5px">
                                    1、点击 "添加图片" ，在相册中选择后点击按钮 "确认保存" ，即可生成用户个人的专属 "味爱行走" 宣言海报，不满意可以点 "重新选择" ，确认后根据提示将图片保存至本地；
                                </p>
                                <p style="padding: 2px 0;letter-spacing: 0.5px">
                                    2、将保存的图片替换成为微信运动封面，在活动期间（9月16~9月19日）的任一天内，获得微信运动冠军，即可将界面截图保存并以 "手机号+图片" 的形式发送至东门中心城官方微信公众号后台，在9月19本城主将以微信图文的形式告知参与活动的小伙伴获奖名单，敬请期待；
                                </p>
                                <p style="padding: 2px 0;letter-spacing: 0.5px">
                                    3、本次活动获得券仅限9月20日当天使用，且不与其他活动所获券叠加；
                                </p>
                                <p style="padding: 2px 0;letter-spacing: 0.5px">
                                    4、每个微信号仅限参与一次，数量有限，先到先得；
                                </p>
                                <p style="padding: 2px 0;letter-spacing: 0.5px">*本活动最终解释权归东门中心城所有。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 如果需要滚动条 -->
        <div class="audio-btn fa-spin"></div>
        <div class="help-up animated-infinite"></div>
        <div id="bg-audio" style="display: none;">
            <audio autoplay loop="loop" preload src="./audio/bg.mp3?01"></audio>
        </div>
    </div>
    <div id="j_backdrop" class="backdrop">
        <div class="backdrop-body">
            <img src='./images/load.gif' />
            <p>正在上传，请稍等...</p>
        </div>
    </div>
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
    <!--<script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.0/jquery.min.js"></script>-->
    <script type="text/javascript" src="./js/jquery.form.js"></script>
    <script type="text/javascript" src="./js/swiper.min.js"></script>
    <script type="text/javascript" src="./js/swiper.animate1.0.2.min.js"></script>
    <script type="text/javascript" src="./js/my.js?07"></script>


    <!-- 微信分享 -->
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script>
        var a = '<?php echo $signPackage[appId]?>',
            b =  '<?php echo $signPackage[timestamp]?>',
            c = '<?php echo $signPackage[nonceStr]?>',
            d = '<?php echo $signPackage[signature]?>';
        var wc_title = "味爱行走",
            wc_link  = 'http://www.baobao-home.com/160914_dongmen_h5/',
            wc_content = "争微信运动冠军封面，赢取9块2美食大餐",
            wc_imgurl = 'http://www.baobao-home.com/160914_dongmen_h5/images/fen.jpg';
    </script>
<script src="./js/weichatSDK.js"></script>
<script language="javascript" type="text/javascript" src="http://js.users.51.la/18980107.js"></script>
<noscript><a href="http://www.51.la/?18980107" target="_blank"><img alt="&#x6211;&#x8981;&#x5566;&#x514D;&#x8D39;&#x7EDF;&#x8BA1;" src="http://img.users.51.la/18980107.asp" style="border:none" /></a></noscript>
</body>
</html>
