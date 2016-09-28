<?php
/*
 *文件上传插件(跨域)
 *作者：xiayuxuan
 *修改日期：2016/09/14
*/
include_once "./imgThum.php";
class FileUpload{

    const max_upload_file_size = 4194304;
    
    /*
    *处理上传
    *$path string 存放目录
    *$thumarray array 要生成的缩略图尺寸，二维数组
    *$shea int 是否剪裁
    */

    public static function L_Upload($path,$thumarray = array(),$shear=0){
        date_default_timezone_set('Asia/Shanghai');//时区
        if(@is_uploaded_file($_FILES['upfile']['tmp_name'])){
            $upfile=$_FILES["upfile"];
            //获取数组里面的值
            $name=$upfile["name"];//上传文件的文件名
            $type=$upfile["type"];//上传文件的类型
            $size=$upfile["size"];//上传文件的大小
            $tmp_name=$upfile["tmp_name"];//上传文件的临时存放路径
            //判断是否为图片
            if(self::checkFileType($type) == false) {echo "上传文件格式不正确!";exit();}
            //检查文件大小是否过大
            if(self::checkFileSize($size) == false){echo "上传文件不能大于4M";exit();}

        /**
         * 0:文件上传成功<br/>
         * 1：超过了文件大小，在php.ini文件中设置<br/>
         * 2：超过了文件的大小MAX_FILE_SIZE选项指定的值<br/>
         * 3：文件只有部分被上传<br/>
         * 4：没有文件被上传<br/>
         * 5：上传文件大小为0
         */
        $error=$upfile["error"];//上传后系统返回的值

        //上传到文件夹位置
       	$Uppath = $path."/".date("Y")."/".date("m")."/".date("d")."/";
        //文件夹不存在创建文件夹
        if(!is_dir($Uppath)){mkdir($Uppath,0755,true);}
        //上传之后的文件名
        $rand_str = date("His")."_".rand(100,999);
        $fileName = $rand_str.".jpg";
        $new_path_file_name = $Uppath.$fileName;

        move_uploaded_file($tmp_name,$new_path_file_name);
        //传到图片服务器存放的位置

        $imgt = new imgThum();
        $imgt->img2thumb($new_path_file_name, $Uppath.$rand_str.'_150.jpg', 207, 235,1);


        $dst_path = './images/slider5/card.jpg';
        $src_path = $Uppath.$rand_str.'_150.jpg';
        //创建图片的实例
        $dst = imagecreatefromstring(file_get_contents($dst_path));
        $src = imagecreatefromstring(file_get_contents($src_path));
        //获取水印图片的宽高
        list($src_w, $src_h) = getimagesize($src_path);
        //将水印图片复制到目标图片上，最后个参数50是设置透明度，这里实现半透明效果
        imagecopymerge($dst, $src, 39, 208, 0, 0, $src_w, $src_h, 100);
        //如果水印图片本身带透明色，则使用imagecopy方法
        //imagecopy($dst, $src, 10, 10, 0, 0, $src_w, $src_h);
        //输出图片
        list($dst_w, $dst_h, $dst_type) = getimagesize($dst_path);
        switch ($dst_type) {
            case 1://GIF
                header('Content-Type: image/gif');
                imagegif($dst,$Uppath.$rand_str."_d.png");
                break;
            case 2://JPG
                header('Content-Type: image/jpeg');
                imagejpeg($dst,$Uppath.$rand_str."_d.png");
                break;
            case 3://PNG
                header('Content-Type: image/png');
                imagepng($dst,$Uppath.$rand_str."_d.png");
                break;
            default:
                break;
        }



        $result = self::checkError($error,$Uppath.$rand_str."_d.png");
        echo json_encode($result);
	}

   }

    /*检查文件是否合法*/
    public function checkFileType($type){
        $imgType = array(
            'image/pjpeg',
            'image/jpeg',
            'image/gif',
            'image/png',
        );
        if(in_array($type, $imgType)){
            return true;
        }else{
            return false;//文件不合法
        }
    }
    
    //检查文件大小
    public function checkFileSize($fileSize){
    	if($fileSize > self::max_upload_file_size){
    		return false;
    	}else{
    		return true;
    	}
    }

    //检查错误
    private function checkError($error,$new_path_file_name){
        $return = array();
        switch ($error) {
           case 0://文件上传成功
                $return['state'] = 1;
                $return['img'] = $new_path_file_name;
                $return['info'] = '上传成功！'; 
               break;
           case 1:
                $return['state'] = 0;
                $return['info'] = '文件超出了大小限制'; 
               break;
            case 2:
                $return['state'] = 0;
                $return['info'] = '超过了文件的大小MAX_FILE_SIZE选项指定的值'; 
                break;
            case 3:
                $return['state'] = 0;
                $return['info'] = '文件只有部分被上传'; 
                break;
            case 4:
                $return['state'] = 0;
                $return['info'] = '没有文件被上传'; 
                break;
            case 2:
                $return['state'] = 0;
                $return['info'] = '超过了文件的大小MAX_FILE_SIZE选项指定的值'; 
                break;
           default:
               echo "上传文件大小为0";
               break;
       }
       return $return;
    }
}
?>