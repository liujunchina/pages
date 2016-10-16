var path = require('path');
var glob = require('glob');
var util = require('util');
var autoprefixer = require('autoprefixer');
var utils = require('./utils');

// 移动端
var pxtorem = require('postcss-px2rem');
var mPstcssConfig = [autoprefixer({ browsers:["android 4", "iOS 6"]}), pxtorem({ remUnit: 75 })];

// pc config
var webpack= require('webpack');
var pkg=require("./package.json");

var ExtractTextPlugin = require('extract-text-webpack-plugin'); //提取文本
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成 html 模板
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin; //丑化
//引入路径
var node_modules = path.resolve(__dirname, 'node_modules');

// webpack/hot/only-dev-server 如果你喜欢手动更新
var webpackHot='webpack/hot/dev-server';
var webpackClient='webpack-dev-server/client?http://'+pkg.config.devHost+':'+pkg.config.devPort;

/**
 * 获得路径
 * @param globPath: str
 * @param pathDir: str 对比路径
 * @returns {{}}
 */
function getEntry(globPath, pathDir,isDebug) {
    var files = glob.sync(globPath);
    var entries = {},
        templates = {},
        entry, dirname, basename, pathname, extname,outFileName;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];

        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname,  basename));
        pathDir = path.normalize(pathDir);
        outFileName = path.normalize(dirname);
        if(pathname.startsWith(pathDir)){
            pathname = pathname.substring(pathDir.length)
        }

        if(outFileName.startsWith(pathDir)){
            outFileName = outFileName.substring(pathDir.length)
        }else{
            outFileName = pathname;
        }

        // path window和liunx斜线相反 ...
        pathname = pathname.replace(/\\/g,'/');
        outFileName = outFileName.replace(/\\/g,'/');

        entries['webpack/' + outFileName] = ['./' + entry];
        templates[pathname] = {
            skin:pkg.skin,
            chunks: [
                // 'common/vue',
                'common/common-lib',
                'webpack/' + outFileName,
            ],
            filename: '' + outFileName + '.html',
            template: './src/pages/' + pathname + '.ejs',
            inject: 'body',
            // chunksSortMode: 'dependency',
            chunksSortMode: 'dependency',
            hash: false,
        };

        if(!isDebug){
            /*
             * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
             * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
             * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
             * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
             */
            templates[pathname]['minify'] = { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true, //删除空白符与换行符
                // Teach html-minifier about Angular 2 syntax
                customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ,[/\@[^=]*/, /\s?/,/\{\{(#|\^)[^}]+\}\}/,/\{\{\/[^}]+\}\}/,/\{\% if[^}]+\%\}/,/\{\%[^}]+endif \%\}/]],
                customAttrAssign: [ /\)?\]?=/ ],
            };
        }
    }
    return {
        entries:entries,
        templates:templates
    };
}

module.exports=function (options) {
    options = options || {};
    var DEBUG = options.debug !==undefined ? options.debug :true;

    //生成路径字符串
    var _path = pkg.config.buildDir;

    var allEntries = getEntry('src/pages/**/*.js', 'src/pages/',DEBUG);
    var htmlWebpackPluginConfig = (function (templates) {
        var config = [];
        for(var key in templates){
            if(templates.hasOwnProperty(key)){
                config.push(new HtmlWebpackPlugin(templates[key]));
            }
        }
        return config;
    })(allEntries.templates);

    // 获取js
    var entries = allEntries.entries;
    //用entries 获取 html 多模块入口文件
    var pages = Object.keys(entries);

    //#如果需要 ie8~9 下调试注释这里 ie8~9 不支持热调试
    //     if(DEBUG){
    //         pages.forEach(function (e) {
    //             entries[e].unshift(webpackClient,webpackHot)
    //         });
    //     }
    //#end

    var config = {
        entry: Object.assign(entries, {
            // 用到什么公共lib css（例如jquery.js），就把它加进common去，目的是将公用库单独提取打包
            'common/common-lib': [
                // 'jquery',  // jquery
                'cookie',  // cookie
                'base',    // 基础方法

                path.resolve(__dirname, 'src/sass/common.scss')
            ],
            // 'common/vue': [
            //     'vue',
            //     'vue-router',
            //     path.resolve(__dirname, 'src/commonjs/filters.js'), // Vue过滤器
            // ]
        }),
        output: {
            path: path.join(__dirname, _path),
            publicPath: '/',
            filename: '[name].js',
            // filename: '[name].js?[chunkhash]',  // chunkhash是根据具体模块文件的内容计算所得的hash值，所以某个文件的改动只会影响它本身的hash指纹，不会影响其他文件
        },
        module: {
            loaders: [
                {
                    test: /\.(mjs|js)$/,
                    // excluding some local linked packages.
                    // for normal use cases only node_modules is needed.
                    exclude: /node_modules|lib|dev\/avalon|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                    loader: 'babel',
                    query: {
                        presets: ['es2015'],
                        plugins: [
                            'transform-runtime',
                            // 'transform-es2015-typeof-symbol'
                        ],
                    }
                },
                {
                    test: /\.tpl/,
                    loader: 'text-loader'
                },
                {
                    test: /\.(png|jpg)$/,
                    loader: 'url-loader?limit=4096&name=images/[name]-[hash].[ext]'
                },
                {
                    test: /\.html$/,
                    loader: "html",
                    query: {
                        minimize: false,    // 不开启压缩html
                        // removeComments: true,
                        // collapseWhitespace: false, //删除空白符与换行符
                        // // Teach html-minifier about Angular 2 syntax
                        // customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ,[/\@[^=]*/, /\s?/,/\{\{(#|\^)[^}]+\}\}/,/\{\{\/[^}]+\}\}/,/\{\% if[^}]+\%\}/,/\{\%[^}]+endif \%\}/]],
                        // customAttrAssign: [ /\)?\]?=/ ],
                    }
                },
                {
                    test: /\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?name=_fonts/[name].[ext]' //这里前缀路径 publicPath 参数为基础
                },
                {
                    test: /\.vue$/, // a regex for matching all files that end in `.vue`
                    loader: 'vue'   // loader to use for matched files
                }
            ]
        },
        vue: {
            loaders: utils.cssLoaders({
                sourceMap: !DEBUG,
                extract: !DEBUG
            }),
            // loaders: [
            //     { test: /\.css$/, loader: "style-loader!css-loader!postcss-loader" }
            // ],
            postcss: function () {
                return mPstcssConfig;
            }
        },
        postcss:function () {
            return mPstcssConfig;
        },
        resolve: {
            extensions: ['', '.js', '.json'],
            alias: {
                'lib': path.resolve(__dirname, 'src/lib'),
                'commonjs': path.resolve(__dirname, 'src/commonjs'),
                'common': path.resolve(__dirname, 'src/common'),
                'scss': path.resolve(__dirname, 'src/sass'),
                "components": path.resolve(__dirname, 'src/components'),
                "images": path.resolve(__dirname, 'src/images'),

                'vue':path.resolve(__dirname,'src/lib/vue.js'),
                'vue-router':path.resolve(__dirname,'src/lib/vue-router.js'),
                'base':path.resolve(__dirname, 'src/commonjs/base.js'),
                'cookie':path.resolve(__dirname, 'src/lib/cookie.js'),
                'jquery': path.resolve(__dirname, 'src/lib/jquery.2.1.4.min.js')
            }
        },
        plugins: [
            // new webpack.optimize.CommonsChunkPlugin({
            //     names: ['common/vue', 'common/common-lib'],
            //     minChunks: Infinity
            // }),

            new webpack.optimize.CommonsChunkPlugin({
                names: ['common/common-lib'],
                minChunks: Infinity
            }),

            new webpack.ProvidePlugin({
                /*
                Vue: 'vue', // 加载Vue全局
                vueRouter: 'vue-router', //路由
                Base: 'base',  // Base
                Cookie: 'cookie' // cookie
                 */
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.DedupePlugin()

        ].concat(htmlWebpackPluginConfig),
        //使用webpack-dev-server，提高开发效率
        //启用热服务有两种 如果是 api 启动方式, 这里只是一个配置目录,不会被webpack读取,
        //只有命令行才会读取这个参数
        devServer: {
            contentBase: path.resolve( pkg.config.buildDir),
            host:pkg.config.devHost,
            port: pkg.config.devPort,
            hot: true,
            noInfo: true,
            inline: true,
            stats: { colors: true },
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            headers: { "X-Custom-Header": "yes" },
            proxy: {
                // '/api/*': {
                //     target: 'http://www.wandetech.com',
                //     secure: false
                // }
            }
        }
    };

    // 提供公共js 压缩优化代码 只在build执行
    config.plugins = config.plugins.concat(!DEBUG ? [
        new ExtractTextPlugin('css/[name].css?[contenthash]', {
            allChunks: true
        }),
        new UglifyJsPlugin({ //压缩代码
            sourceMap: false,
            drop_console: true,
            compress: {
                warnings: false
            },
            except: [ '$', 'exports', 'require'] //排除关键字
        })
    ] : [
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
    ]);

    // 设置提取css插件，只在build提取
    config.module.loaders = config.module.loaders.concat(DEBUG ? [
        {
            test: /\.css$/,
            loader: 'style!css!postcss'
        },
        {
            test:/\.scss$/,
            loader: 'style!css!postcss!sass'
        }
    ] : [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
    },
    {
        test:/\.scss$/,
        loader: ExtractTextPlugin.extract('style','css!postcss!sass')
        // loader: 'style!css!sass'
    }]);

    // 设置 outPut
    !DEBUG && (config.output.filename = '[name].js?[chunkhash]');

    return config
};


