var server = require('http').createServer()
    , url = require('url')
    , WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ server: server })
    , express = require('express')
    , app = express()
    , port = 3000;

app.use(function (req, res) {
    res.send({ 你好: "逗逼" });
});

var userData = [{
    username:'阿狗',
    userId:'123'
},{
    username:'阿呆',
    userId:'1234'
},{
    username:'阿猫',
    userId:'123s5'
},{
    username:'阿傻',
    userId:'12311'
}]

// type : 0 用户信息
// type : 1 用户消息
// type : 2 系统消息

var generateUser = function () {
    var index = Math.floor(Math.random() * userData.length);
    var user = Object.assign({},userData[index]);
    // userData.slice(index,1);
    user.type = 0;
    return user;
};

function strJson(json) {
    return JSON.stringify(json);
}
function parseJson(str) {
    return JSON.parse(str);
}

// 广播消息到所有人,排除发送消息者
wss.broadcast = function broadcast(data,ws) {
    wss.clients.forEach(function each(client) {
        if(typeof ws != 'undefined'){
            if (client !== ws) client.send(strJson(data));
        }else{
            client.send(strJson(data));
        }
    });

    console.log('广播数据',data)
};

wss.on('connection', function connection(ws) {
    // var location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    var user = generateUser();

    // 接受消息
    ws.on('message', function incoming(message) {
        if(message){
            // 广播消息给其他人
            message =  parseJson(message);
            message.type = 1;
            message.id = String(+new Date()),
            wss.broadcast(message);
        }
    });

    // 退出聊天
    ws.on('close', function(close) {
        console.log('链接关闭,刷新页面了');
    });

    // 分配用户名 用户id

    ws.send(strJson(user));

    // 广播上线消息
    wss.broadcast({
        type : 2 ,
        id: String(+new Date()),
        message :user.username + '上线了'
    });
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });