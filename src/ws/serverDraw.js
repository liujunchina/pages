var server = require('http').createServer()
    , url = require('url')
    , WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ server: server })
    , express = require('express')
    , app = express()
    , port = 3001;

app.use(function (req, res) {
    res.send({ 你好: "逗逼" });
});

// 广播消息到所有人,排除发送消息者
wss.broadcast = function broadcast(data,ws) {
    wss.clients.forEach(function each(client) {
        if (client !== ws) client.send(data);
    });
};

wss.on('connection', function connection(ws) {
    // var location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    // 接受消息
    ws.on('message', function incoming(message) {
        if(message){
            // 广播消息给其他人
            wss.broadcast(message,ws);
        }
    });

    // 退出聊天
    ws.on('close', function(close) {
        console.log('链接关闭,刷新页面了');
    });

    console.log('新用户');
    ws.send('恭喜你链接成功');
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });