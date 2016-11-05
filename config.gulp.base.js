/**
 * Created by Liu.Jun on 2016/9/13.
 */
var gulp = require('gulp');
var del = require('del');
var pkg = require('./package.json');

var copyDir = pkg.gulpConfig.copyDir;
var copyDirBasePath = pkg.gulpConfig.copyDirBasePath;
var buildDir = pkg.config.buildDir;
var compressCSSPath = ['css'];
var compressJsPath = ['common','webpack'];

// gulp
// 错误管理，避免错误后结束进程
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var cleanCSS = require("gulp-clean-css");
var uglify = require('gulp-uglify');

function srcList(list,ext) {
    var result = [];
    ext = ext || '.js';
    list.forEach(function (v) {
        result.push(buildDir + v + '/**/**' + ext);
    });
    console.log('--->' + ext + ' path: [ ' + result + ' ]');
    return result;
}

gulp.task('copyStatic',function(){
    console.log('\n->复制静态文件');
    return gulp.src(copyDir, {base: copyDirBasePath})
        .pipe(gulp.dest(buildDir));
});

gulp.task('cleanBuild', function (cb) {
    console.log('删除 build 文件夹');
    del([buildDir],cb);
});

gulp.task('build', ['cleanBuild'], function () {
    console.log('复制文件');
    gulp.start(['copyStatic']);
});

gulp.task('build', ['cleanBuild'], function () {
    gulp.start(['copyStatic']);
});

gulp.task('build:css', function () {
    console.log('-->压缩css start....');
    return gulp.src(srcList(compressCSSPath,'.css'),{
        base:buildDir
    }).pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(cleanCSS({
            compatibility: 'ie7'
        }))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build:js', function () {
    console.log('-->压缩js start....');
    return gulp.src(srcList(compressJsPath,'.js'),{
        base:buildDir
    }).pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(uglify({
            sourceMap: false,
            compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: true,
            },
            mangle: {except: ['$super', '$', 'exports', 'require','avalon']} //排除关键字
        }))
        .pipe(gulp.dest(buildDir));
});

exports.copyDir= function () {
    // gulp build ,文件占用 无法删除，所以无法回调
    gulp.start(['copyStatic']);
};

exports.compressCssJsHtml = function (isHtml) {
    isHtml = isHtml || false;   // 默认不压缩html
    gulp.start(['build:css','build:js']);
};
