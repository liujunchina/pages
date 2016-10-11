var util = require('util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var opn = require('opn'); //打开浏览器
var pkg = require('./package.json');
//获取端口
var port = pkg.config.devPort;
var host = pkg.config.devHost;

var configPath = './config.dev';
var config = require(configPath);

// gulp run
// var gulpTask = require('./config.gulp.base');
// gulpTask({debug:true});

var devServer=config.devServer;

var server = new WebpackDevServer(
    webpack(config),
    devServer
);

server.listen(port, host, function (err) {
  if (err) { console.log(err); }
  var url = util.format('http://%s:%d', host, port);
  console.log('Listening at %s', url);
  // opn(url+'/_views');
});
