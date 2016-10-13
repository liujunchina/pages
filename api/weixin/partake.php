<?php
	include "../class/WeixinJsSdk.class.php";
	include "./config.php";
	$jssdk = new JSSDK(APPID, APPSECRET);
	$signPackage = $jssdk->GetSignPackage();

	echo json_encode($signPackage);
	exit;
