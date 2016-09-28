<?php

/**
 * 微信接口
 * @author xiayuxuan
 */
class WeixinAction extends Action{
	private $app_id = 'wx02ac9ee3fc9854fc';
	private $app_secret = '9e61b9e28a631042bdda3706ae1db053';
	
	/**
	 * 获取微信授权链接
	 *
	 * @param string $redirect_uri 跳转地址
	 * @param mixed $state 参数
	 */
	public function get_authorize_url($redirect_uri = '', $state = '')
	{
		$redirect_uri = urlencode($redirect_uri);
		$url =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid={$this->app_id}&redirect_uri={$redirect_uri}&response_type=code&scope=snsapi_userinfo&state={$state}#wechat_redirect";
		header("Location:".$url);
	}
	
	/**
	 * 获取授权token
	 *
	 * @param string $code 通过get_authorize_url获取到的code
	 */
	public function get_access_token($app_id = '', $app_secret = '', $code = '')
	{
		$code = $_GET['code'];
		$token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$this->app_id}&secret={$this->app_secret}&code={$code}&grant_type=authorization_code";
		$token_data = $this->http($token_url);
	
		if($token_data[0] == 200)
		{
			return json_decode($token_data[1], TRUE);
		}
	
		return FALSE;
	}
	
	/**
	 * 获取授权后的微信用户信息
	 *
	 * @param string $access_token
	 * @param string $open_id
	 */
	public function get_user_info($access_token = '', $open_id = '')
	{
		if($access_token && $open_id)
		{
			$info_url = "https://api.weixin.qq.com/sns/userinfo?access_token={$access_token}&openid={$open_id}&lang=zh_CN";
			$info_data = $this->http($info_url);
	
			if($info_data[0] == 200)
			{
				return json_decode($info_data[1], TRUE);
			}
		}
	
		return FALSE;
	}
	
	
	public function http($url, $method, $postfields = null, $headers = array(), $debug = false)
	{
		$ci = curl_init();
		curl_setopt($ci, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
		curl_setopt($ci, CURLOPT_CONNECTTIMEOUT, 30);
		curl_setopt($ci, CURLOPT_TIMEOUT, 30);
		curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
	
		switch($method){
			case 'POST':
				curl_setopt($ci, CURLOPT_POST, true);
				if (!empty($postfields)) {
					curl_setopt($ci, CURLOPT_POSTFIELDS, $postfields);
					$this->postdata = $postfields;
				}
				break;
		}
		curl_setopt($ci, CURLOPT_URL, $url);
		curl_setopt($ci, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ci, CURLINFO_HEADER_OUT, true);
		$response = curl_exec($ci);
		$http_code = curl_getinfo($ci, CURLINFO_HTTP_CODE);
		if($debug){
			echo "=====post data======\r\n";
			var_dump($postfields);
			echo '=====info=====' . "\r\n";
			print_r(curl_getinfo($ci));
			echo '=====$response=====' . "\r\n";
			print_r($response);
		}
		curl_close($ci);
		return array($http_code, $response);
	}
	
	
	/**
	 * 发送微信模板消息
	 * （注意：用户必须已关注我们的微信公众号）
	 * @param array() $Data 数组数据，数据索引如下<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string templateID 消息模板ID <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string data 消息体 <br>
	 * @throws SkylinException
	 * @return Object 返回接口调用信息
	 * 样例
	 * {
	 * errcode:错误码，0表示成功,
	 * errmsg:错误消息，ok表示成功,
	 * msgid:消息id
	 * }
	 */
	public function sendMsg($Data = array())
	{
		$toUserName = isset($Data['toUserName'])?trim($Data['toUserName']):''; //接收方帐号（收到的OpenID）
		$templateID = isset($Data['templateID'])?trim($Data['templateID']):''; //消息模板ID
		$url = isset($Data['url'])?trim($Data['url']):''; //点击消息体进入的链接地址
		$data = isset($Data['data'])?$Data['data']:''; //消息体
	
		if($toUserName == '')throw new Exception('接收方openID必须设置',-1);
		if($templateID == '')throw new Exception('消息模板ID必须设置',-1);
	
		//组建消息体
		$msgBody = array(
				'touser' => $toUserName,
				'template_id' => $templateID,
				'url' => $url,
				'topcolor' => '#FFFFFF',
				'data' => $data
		);
	
		$jsonData = json_encode($msgBody);
	
		$accessInfo = $this->getAccessToken();
		if(isset($accessInfo->errcode))
		{
			throw new Exception('获取微信调用凭证失败',-1);
		}
	
		$access_token  = $accessInfo->access_token;
	
		$url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=".$access_token;
	
		$ch=curl_init();
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 1);
	
		curl_setopt($ch,CURLOPT_POST,1);
		curl_setopt($ch,CURLOPT_POSTFIELDS,$jsonData);
	
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	
		$html=curl_exec($ch);
		curl_close($ch);
	
		$rs = json_decode($html);
	
		return $rs;
	}
	
	
	public function getAccessToken()
	{
		if(!S('accessInfo')){
			$code = $this->_get("code");
			$state = $this->_get("state");
			$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$this->app_id."&secret=".$this->app_secret;
			$ch=curl_init($url);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 1);
			curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
			//curl_setopt($ch, CURLOPT_COOKIEFILE,$this->cookieFile);
			curl_setopt($ch,CURLOPT_REFERER,$url);
			curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0');
			$html=curl_exec($ch);
			curl_close($ch);
			$accessInfo = json_decode($html);
			S('accessInfo',$accessInfo,7200);
		}else{
			$accessInfo = S('accessInfo');
		}
		
		$this->accessTokenType = 'GLOBAL';
		return $accessInfo;
	}
	
	
	/**
	 * 业务员登录微信通知
	 * （注意：用户必须已关注我们的微信公众号）
	 * @param array() 数组数据，数据索引如下<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string account 账号 <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string accountName 业务员姓名
	 * @return bool 成功返回true,失败产生异常
	 */
	public function salesmanLoginMessage($Data = array()) {
		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址
		$account = isset($Data['account']) ? trim($Data['account']) : '';//登录的账号
		$accountName = isset($Data['accountName']) ? trim($Data['accountName']) : '';//登录的业务员姓名
		
		try {
		
			$remark = "";
			$remark = "\r\n点击这里查看详情。";
							
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => '3d0OFt2z7CSzNvLrYpdYYj0fUZ6FrQUSYAr5kHrR5gc',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> '业务员('.$accountName.'),您好!','color'=>'#000000'),
							'keyword1'=>array('value'=>$account,'color'=>'#000000'),
							'keyword2'=>array('value'=>date('Y-m-d H:i:s'),'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);
			$accessInfo = $this->sendMsg($Data);
			
			if($accessInfo->errcode == 0)
			{
				return true;
			}
		}
		catch (Exception $e)
		{
			throw new Exception($e->getMessage(),$e->getCode());
		}
	}
	
	/**
	 * 药店登录微信通知
	 * （注意：用户必须已关注我们的微信公众号）
	 * @param array() 数组数据，数据索引如下<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string account 账号 <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string ip ip地址 <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string member_type 类型 <br>
	 * @return bool 成功返回true,失败产生异常
	 */
	public function memberLoginMessage($Data = array()){

		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址
		$account = isset($Data['account']) ? trim($Data['account']) : '';//登录的账号
		$client = isset($Data['client']) ? trim($Data['client']) : '';//登录设备（pc 或 mobile）
		$ip = isset($Data['ip']) ? trim($Data['ip']) : '';//登录ip
		$member_type = !empty($Data['member_type']) ? $Data['member_type'] : '(药店/诊所)会员登录';
		try {
			switch ($client)
			{
			case 'pc':
			  $loginClient =  "电脑登录";
			  break;
			case 'mobile':
			  $loginClient =  "手机登录";
			  break;
			}
			
			$remark = "";
			$remark .= "\r\n登录设备：".$loginClient;
			$remark .= "\r\n登录地点：".IPgetCity($ip);
			$remark .= "\r\n点击这里查看详情。";
				
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => '3d0OFt2z7CSzNvLrYpdYYj0fUZ6FrQUSYAr5kHrR5gc',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> '登录类型：'.$member_type,'color'=>'#000000'),
							'keyword1'=>array('value'=>$account,'color'=>'#000000'),
							'keyword2'=>array('value'=>date('Y-m-d H:i:s'),'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);
			$accessInfo = $this->sendMsg($Data);
				
			if($accessInfo->errcode == 0)
			{
				return true;
			}
		}
		catch (Exception $e)
		{
			throw new Exception($e->getMessage(),$e->getCode());
		}
		
	}
	
	/**
	 * 药店下单之后通知相应的业务员
	 * array 数组数据，数据索引如下
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string orderID 订单ID <br>
	 * @return bool 成功返回true,失败产生异常
	 */
	public function salesmanOrderMessage($Data = array()) {
		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址
		$orderID = isset($Data['orderID']) ? trim($Data['orderID']) : '';//订单ID
		$buyer_id = M('order')->where(array('order_id'=>$orderID))->getField('buyer_id');
		$drug_name = M('buy_joinin')->where(array('member_id'=>$buyer_id))->getField('company_name');
		//收货人信息
		$common_info = M('order_common')->where(array('order_id'=>$orderID))->find();
		$common  = unserialize($common_info['reciver_info']);
		
		//购物清单
		$goods = M('order_goods')->where(array('order_id'=>$orderID))->select();
		$goods_name = '';
		foreach ($goods as $k=>$v){
			$goods_name .= $v['goods_name']." x".$v['goods_num']."  ";
		}

		try {
		
			$remark = "";
			$remark .= "\r\n下单时间：".date('Y-m-d H:i:s');
			$remark .= "\r\n点击这里查看详情。";
				
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => 'nMIuqeZwa_vS_LV2xgtWCFeIEFJ5BT4sTrHM21kxhzE',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> '您有新订单啦！','color'=>'#000000'),
							'keyword1'=>array('value'=>$common_info["reciver_name"]."（".$drug_name."）",'color'=>'#000000'),
							'keyword2'=>array('value'=>$common['phone'],'color'=>'#000000'),
							'keyword3'=>array('value'=>str_replace('&nbsp;',' ',$common['address']),'color'=>'#000000'),
							'keyword4'=>array('value'=>$goods_name,'color'=>'#000000'),
							'keyword5'=>array('value'=>$common_info['order_message'],'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);
			$accessInfo = $this->sendMsg($Data);
				
			if($accessInfo->errcode == 0)
			{
				return true;
			}
		}
		catch (Exception $e)
		{
			throw new Exception($e->getMessage(),$e->getCode());
		}
	}
	
	/**
	 * 药店申请采购通知业务员
	 * array 数组数据，数据索引如下
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string drugID 待审核ID <br>
	 * @return bool 成功返回true,失败产生异常
	 */
	public function salesmanExamineMessage($Data = array()){
		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址
		$drugID = isset($Data['drugID']) ? trim($Data['drugID']) : '';//药店ID
		
		try {
			$drug_name = M('buy_joinin')->where(array('member_id'=>$drugID))->getField('company_name');
			
			$remark = "";
			$remark .= "\r\n点击这里查看详情。";
		
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => '0h7nNqS5qi3Z7XPtlRmH_BVIzKrwx7vzKhA__XgJ9y8',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> '您好，新的药店需要审核!','color'=>'#000000'),
							'keyword1'=>array('value'=>"申请采购",'color'=>'#000000'),
							'keyword2'=>array('value'=>$drug_name,'color'=>'#000000'),
							'keyword3'=>array('value'=>date('Y-m-d H:i:s'),'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);
			$accessInfo = $this->sendMsg($Data);
		
			if($accessInfo->errcode == 0)
			{
				return true;
			}
		}
		catch (Exception $e)
		{
			throw new Exception($e->getMessage(),$e->getCode());
		}
	}
	
	
	/**
	 * 审核合伙人通知
	 * array 数组数据，数据索引如下
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string 合伙人姓名 <br>
	 * @return bool 成功返回true,失败产生异常
	 * 
	 */
	public function examineParNotice($Data = array()) {

		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址

		
		try {
			
			$first = '您的实名认证已通过！';
			$remark = "";
			$remark .= "\r\n点击这里查看详情。";
		
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => 'aKy7UyR1RR80QdCXi1ZHc1ufJcdWKofoqMlzocVzzf0',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> $first,'color'=>'#000000'),
							'keyword1'=>array('value'=>$Data['account'],'color'=>'#000000'),
							'keyword2'=>array('value'=>"实名认证",'color'=>'#000000'),
							'keyword3'=>array('value'=>date('Y-m-d H:i:s'),'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);
			$accessInfo = $this->sendMsg($Data);
		
			if($accessInfo->errcode == 0)
			{
				return true;
			}
		}
		catch (Exception $e)
		{
			throw new Exception($e->getMessage(),$e->getCode());
		}
		
	}
	
	
	
	/**
	 * 审核合伙人通知（未通过）
	 * array 数组数据，数据索引如下
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string 合伙人姓名 <br>
	 * @return bool 成功返回true,失败产生异常
	 *
	 */
	public function noexamineParNotice($Data = array()) {
	
		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址

	
		try {
				
			$first = '抱歉，您的实名认证审核未通过！';
			$remark = "";
			$remark .= "\r\n点击这里查看详情。";
	
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => 'FYZpwI8h5vfSXzzci_Pt8FoZ7FCOlfNx0BTvpkkzAFc',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> $first,'color'=>'#000000'),
							'keyword1'=>array('value'=>$Data['account'],'color'=>'#000000'),
							'keyword2'=>array('value'=>$Data['why'],'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);
			$accessInfo = $this->sendMsg($Data);
	
			if($accessInfo->errcode == 0)
			{
				return true;
			}
		}
		catch (Exception $e)
		{
			throw new Exception($e->getMessage(),$e->getCode());
		}
	
	}
	
	
	
	/**
	 * 提现审核结果通知
	 * array 数组数据，数据索引如下
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string money 提现金额  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string payType 提现方式 <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string applyTime 申请时间<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string examState 审核结果<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string url 点击消息体进入的链接地址  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string message 附加消息 <br>
	 * @return bool 成功返回true,失败产生异常
	 *
	 */
	public function withdrawalsExamineNotice($Data = array()) {
		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$money = isset($Data['money']) ? trim($Data['money']) : ''; //提现的金额
		$payType = isset($Data['payType']) ? trim($Data['payType']) : ''; //支付方式
		$applyTime = isset($Data['applyTime']) ? trim($Data['applyTime']) : ''; //申请时间
		$examState = isset($Data['examState']) ? trim($Data['examState']) : ''; //审核结果
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址
	
	
		try {
	
			$first = '您好。您的提现申请已处理！';
			$remark = "";
			$remark .= "\r\n信息：".$Data['message'];
			$remark .= "\r\n点击这里查看详情。";
	
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => '2BgIAlOHZtGjI3vcDG_TNGQszmrhTZmbRBFiHtdzKuE',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> $first,'color'=>'#000000'),
							'keyword1'=>array('value'=>$money,'color'=>'#000000'),
							'keyword2'=>array('value'=>$payType,'color'=>'#000000'),
							'keyword3'=>array('value'=>date('Y/m/d H:i',$applyTime),'color'=>'#000000'),
							'keyword4'=>array('value'=>$examState,'color'=>'#BF3EFF'),
							'keyword5'=>array('value'=>date('Y/m/d H:i'),'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);

			$accessInfo = $this->sendMsg($Data);
			if($accessInfo->errcode == 0)
			{
				return true;
			}
		}
		catch (Exception $e)
		{
			throw new Exception($e->getMessage(),$e->getCode());
		}
	
	}
	
	/**
	 * 即时通讯新消息通知
	 * array 数组数据，数据索引如下
	 * &nbsp;&nbsp;&nbsp;&nbsp; string toUserName 接收方帐号（收到的OpenID）  <br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; string fromUser 发送者  <br>
	 * @return bool 成功返回true,失败产生异常
	 */
	public function new_information_notice($Data = array()) {
		$toUserName = isset($Data['toUserName']) ? trim($Data['toUserName']) : ''; //接收方帐号（收到的OpenID）
		$fromUser = isset($Data['formUser']) ? trim($Data['formUser']) : ''; //发送者
		$url = isset($Data['url']) ? trim($Data['url']) : ''; //点击消息体进入的链接地址
		
		try {
			$first = '您好。您有新的消息！';
			$remark = "";
			$remark .= "\r\n点击这里查看详情。";
			
			$Data = array(
					'toUserName' => $toUserName,
					'templateID' => '3oMWYBw7k-80vsiXw006gmEAqTjzwldXgU35ICEDKoI',
					'url' => $url,
					'data' => array(
							'first'=>array('value'=> $first,'color'=>'#000000'),
							'keyword1'=>array('value'=>"新消息通知！",'color'=>'#000000'),
							'keyword2'=>array('value'=>date('Y-m-d H:i:s'),'color'=>'#000000'),
							'keyword3'=>array('value'=>"(".$fromUser.")给您发了一条新消息！",'color'=>'#000000'),
							'remark'=>array('value'=>$remark,'color'=>'#000000')
					)
			);
			
			$accessInfo = $this->sendMsg($Data);
			if($accessInfo->errcode == 0)
			{
				return true;
			}
			
		} catch (Exception $e) {
			throw new Exception($e->getMessage(),$e->getCode());
		}
		
	}
}