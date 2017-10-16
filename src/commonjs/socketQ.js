module.exports =  {
    ip:"",
    sio:null,
    isPinging:false,
    fnDisconnect:null,
    handlers:{},
    connected: false,
    connect:function(fnConnect,fnError) {
        var self = this;

        this.sio = new WebSocket(this.ip);

        this.sio.onopen = function (data) {
            // 建立连接
            self.connected = true;
            fnConnect(data);
        }

        this.sio.onclose = function () {
            // 连接关闭
            console.log("disconnect");
            self.connected = false;
            self.close();
        }

        this.sio.onerror = function () {
            // 发生错误
            console.log('connect_failed');
        }
        
        this.sio.onmessage = function (evt) {
            var data = evt.data,
                cmd;
            try{
                data = JSON.parse(data)
                cmd = data.cmd

                if(self.handlers[cmd]){
                    self.handlers[cmd].call(null,data)
                }else{
                    console.log('消息类型 ' + cmd + ' 未注册')
                }
            }catch (e){
                console.warn('接受消息格式错误：' + evt )
            }
        }

        for(var key in this.handlers){
            var value = this.handlers[key]
            if(typeof(value) == "function"){
                if(key == 'disconnect'){
                    this.fnDisconnect = value
                }
            }
        }
        this.startHearbeat();
    },

    startHearbeat:function(){
        var self = this;

        this.addHandler('game_ping',function(){
            console.log('game_ping:ok');
            self.lastRecieveTime = Date.now();
        });
        this.lastRecieveTime = Date.now();

        if(!self.isPinging){
            self.isPinging = true;
            setInterval(function(){
                if(self.sio){
                    if(Date.now() - self.lastRecieveTime > 10000){
                        self.close();
                    }
                    else{
                        self.ping();
                    }
                }
            },5000);
        }
    },
    ping:function(){
        this.send({
            cmd: 'game_ping'
        });
    },
    close:function(){
        console.log('close');
        if(this.sio && this.connected){
            this.connected = false;
            this.sio.close();
            this.sio = null;
        }
        if(this.fnDisconnect){
            this.fnDisconnect();
            this.fnDisconnect = null;
        }
    },

    addHandler:function(event,fn){
        var handler = function(data){
            //console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
            if(event != "disconnect" && typeof(data) == "string"){
                data = JSON.parse(data);
            }
            fn(data);
        };

        if(this.handlers[event]){
            console.log("event:" + event + "' handler has been registered.");
            return;
        }else{
            if(this.sio){
                this.handlers[event] = handler;
                console.log("register:function " + event);
            }else{
                console.warn("socket is closed ");
            }
        }
    },

    send:function(data){
        if(this.connected){
            if(data != null && (typeof(data) == "object")){
                data = JSON.stringify(data);
                //console.log(data);
            }
            this.sio.send(data);
        }
    },

    test:function(fnResult){
        var xhr = null;
        var fn = function(ret){
            fnResult(ret.isonline);
            xhr = null;
        }

        var arr = this.ip.split(':');
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            ip:arr[0],
            port:arr[1],
        }
        xhr = cc.vv.http.sendRequest("/is_server_online",data,fn);
        setTimeout(function(){
            if(xhr){
                xhr.abort();
                fnResult(false);
            }
        },1500);
    }
}