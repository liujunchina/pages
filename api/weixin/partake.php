<?php
	include "../WeixinJsSdk.class.php";
	$jssdk = new JSSDK('wx02ac9ee3fc9854fc', '9e61b9e28a631042bdda3706ae1db053 ');
	$signPackage = $jssdk->GetSignPackage();

	echo json_encode($signPackage);
	exit;
