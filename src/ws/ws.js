var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 3000, //监听接口
        verifyClient: socketVerify //可选，验证连接函数
    });

function socketVerify(info) {
    return true; //否则拒绝
}

//广播
wss.broadcast = function broadcast(data) {
    console.log('广播message',data);
    wss.clients.forEach(function each(client) {
        client.send('广播messages',data);
    });
};

// 初始化
wss.on('connection', function(ws) {
    console.log('连接新请求');
    ws.send('你是第' + wss.clients.length + '位用户');

    // 接受消息
    ws.on('message', function (data, flags) {
        console.log(flags);
        if(data){
            wss.broadcast(data);
        }
    });

    // 退出聊天
    ws.on('close', function(close) {
        console.log('链接关闭,刷新页面了');
    });

    // 默认消息
    ws.send('something');
});

