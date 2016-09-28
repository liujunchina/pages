/**
 * Created by liu.jun on 15-4-15.
 */
$(function(){
    var mySwiper;
    var myAudio = $("#bg-audio>audio")[0];
    var $save = $('#j_save'),
        $imgWrap = $('#j_imgWrap'),
        $imgTip = $('#j_imgTip'),
        $hideBtn = $('.audio-btn,.help-up'),
        $inputFile = $('#j_outerstore'),
        $backdrop = $('#j_backdrop'),
        $uploadForm = $('#j_uploadForm'),
        // $txtContent = $('.j_txtContent'),
        isUpload = false;
    var initCall = function(){
        $("#preloader").delay(500).fadeOut(500);
    };

    var computeContentHeight = function () {

    };
    var xhrBeforeSend = function () {
        $backdrop.show();
    };
    var xhrSuccess = function (data) {
        if(data.state == 1){
            isUpload = true;
            var image = new Image();
            image.onload = function () {
                $('#j_upload').hide();
                $backdrop.hide();
                $imgWrap.find('img').attr('src',data.img);
            };
            image.src = data.img;
        }else{
            alert(data.info);
            $backdrop.hide();
        }
    };
    var xhrError = function(xhr){
        alert(xhr.responseText ? xhr.responseText : '上传超时');
        $backdrop.hide();
    };
    
    var dataURLtoBlob = function(dataurl){
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    };
    
    $(".audio-btn").on("click",function(){
        if($(this).hasClass("fa-spin")){
            // 播放中
            myAudio.pause();
        }else{
            // 暂停中
            myAudio.play();
        }
        $(this).toggleClass("fa-spin");
    });

    $("#j_upload,#j_reset").click(function () {
        $imgTip.hide();
        $inputFile.trigger('click');
    });

    $save.click(function () {
        if(isUpload){
            $imgTip.show();
        }else{
            alert("请先添加图片");
        }
    });

    $inputFile.change(function(){
        var files = this.files;

        if(files.length > 0){
            var file = files[0];
            if(!file.type.match(/image.*/)){
                alert("请选择图片文件！");
                return false;
            }

            // 文件超过200k 启用压缩
            if (file.size > 200000 && (typeof FileReader === 'function')){
                var reader = new FileReader();
                reader.onload = function (readerEvent) {
                    var image = new Image();
                    image.onload = function (imageEvent) {
                        var canvas = document.createElement('canvas'),
                            maxSize = 400,
                            width = image.width,
                            height = image.height;
                        // 压缩图片
                        if (width > height) {
                            if (width > maxSize) {
                                height *= maxSize / width;
                                width = maxSize;
                            }
                        } else {
                            if (height > maxSize) {
                                width *= maxSize / height;
                                height = maxSize;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext('2d').drawImage(image,0,0,width,height)
                        var blob = dataURLtoBlob(canvas.toDataURL('image/jpeg'));
                        var fd = new FormData();
                        fd.append("upfile", blob,'image.jpg');
                        $.ajax({
                            url:'upload.php',
                            dataType:  'json',
                            data:fd,
                            type : 'POST', //
                            contentType:false, //必须false才会自动加上正确的Content-Type
                            processData:false,//必须false才会避开jQuery对 formdata 的默认处理
                            timeout:   30000,
                            beforeSend: xhrBeforeSend
                        }).done(xhrSuccess)
                            .fail(xhrError);
                    };
                    image.src = readerEvent.target.result;
                };
                reader.readAsDataURL(file);
            }else{
                $uploadForm.ajaxSubmit({
                    dataType:  'json',
                    timeout:   30000,
                    beforeSend: xhrBeforeSend,
                    success: xhrSuccess,
                    error:xhrError
                });
            }
        }
    });

    mySwiper = new Swiper('.swiper-container',{
        direction : 'vertical',
        mousewheelControl : false,
        watchSlidesProgress: true,
        speed : 300,
        onInit: initCall,
        onTransitionStart: function(swiper){
            if(swiper.activeIndex == 4){
                $hideBtn.hide();
                // $txtContent.height(mySwiper.height - $uploadForm.height() - 30);
            }else{
                $hideBtn.show();
            }
        }
    });

    var startScroll, touchStart, touchCurrent,$elm;
    $elm = $('.j_swiperScroll')[0];
    $elm.addEventListener('touchstart', function (e) {
        startScroll = this.scrollTop;
        touchStart = e.targetTouches[0].pageY;
    }, true);
    $elm.addEventListener('touchmove', function (e) {
        touchCurrent = e.targetTouches[0].pageY;
        var touchesDiff = touchCurrent - touchStart;
        var slide = this;
        var onlyScrolling =
            ( slide.scrollHeight > slide.offsetHeight ) &&
            (
                ( touchesDiff < 0 && startScroll === 0 ) ||
                ( touchesDiff > 0 && startScroll === ( slide.scrollHeight - slide.offsetHeight ) ) || //start from bottom edge to scroll top
                ( startScroll > 0 && startScroll < ( slide.scrollHeight - slide.offsetHeight ) ) //start from the middle
            );
        if (onlyScrolling) {
            e.stopPropagation();
        }
    }, true);

    // 计算图片高度
    var parentHeight = mySwiper.width * 0.625;
    $imgWrap.height(parentHeight);
    $imgWrap.parent().height(parentHeight);
    $imgWrap.find('img').css({
        marginTop: - ($imgWrap.width()/2) + 'px'
    })
});


