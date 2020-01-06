var db = require("../models/db.js");
var ObjectID = require('mongodb').ObjectID;//数据库ObjectId
var fs = require('fs');
var child_process = require('child_process');
var formidable = require('formidable');
var nodeJspath = require('path');

var file = require('./file.js');
// 配置文件
var settings = require("../settings.js");

// 对http请求的封装模块
var request = require('request');
// var querystring = require('querystring');

//显示数据映射页面
exports.showMapPage = function (req, res, next) {
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    // req.session.currentRouter = "/datamap";
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render("datamap/mappage", {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_0",
        "th_active": "dp_0_0"
    });
}

//显示使用映射服务的界面
exports.showUsePage = function (req, res, next) {
    // req.session.currentRouter = "/datamap/use";
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render('datamap/usePage', {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_0",
        "th_active": "dp_0_0"
    });
}

//获取udx schema
exports.getUdxSchema = function (req, res, next) {
    var params = req.query;
    var datamapId = params.id;
    var type = params.type;//remote

    if (datamapId == undefined) {
        res.send('-1');//id参数无效
        return;
    }

    var basepath = __dirname + "/../upload/datamap/" + datamapId + '/';
    var cfgJson = '';
    //1.读取配置文件，获取schema所在路径
    try {
        cfgJson = JSON.parse(fs.readFileSync(nodeJspath.normalize(basepath + 'cfg.json')));
    } catch (e) {
        console.log('read cfg.json error: ' + e);
        res.send('-2');
        return;
    }

    var schemaPath = cfgJson.schema;

    //********************************************************* */

    if (type === 'json') {
        // schema 所在的路径
        var path = nodeJspath.normalize(basepath + schemaPath + '/schema.json');

        var json_string = '';
        try {
            json_string = fs.readFileSync(path, "utf-8"); //同步读取文件的方法
        } catch (ex) {
            console.log('read schema.json error: ' + ex);
            res.send('-3');
            return;
        }

        res.send(json_string);
    } else if (type === 'xml') {

        // 远程请求
        // schema 所在的路径
        var path = basepath + schemaPath + '/schema.xml';

        var xml_string = '';
        try {
            xml_string = fs.readFileSync(path, "utf-8"); //同步读取文件的方法
        } catch (ex) {
            console.log('read schema.xml error: ' + ex);
            res.send('-3');
            return;
        }
        res.send(xml_string);
    }
}


//获取节点值
exports.getNode = function (req, res, next) {
    //'filename':filename,'nodename':data.node.text,'type':'xml'
    var paramObj = req.query;
    var serviceid = paramObj.id;//服务id
    //var filename = paramObj.filename;//原始文件路径
    var nodename = paramObj.nodename;
    // var type = paramObj.type;
    var username = req.session.username;

    // 如果是远程请求的话，这里的username是没有值，是undefined，除非是本地请求。

    if (username === undefined) {
        username = req.query.username;
    }

    //var parentid = paramObj.parentid;//当前数据的父目录
    var oid = paramObj.oid;//原始文件名，因为原始文件都是以其id进行命名的。
    var srcPath = __dirname + '/../upload/userdata/' + username + '/' + oid;


    var basedir = __dirname + "/../upload/datamap/" + serviceid + '/';
    // 1. 读取配置文件，获取该映射服务的调用信息
    var cfgJson = '';
    try {
        cfgJson = JSON.parse(fs.readFileSync(basedir + 'cfg.json'));
    } catch (e) {
        console.log('read cfg.json error: ' + e);
        res.send('-1');
        return;
    }

    var type = cfgJson.type;//映射服务的调用类型：jar、exe
    var start = cfgJson.start;//映射服务的入口
    var cmd = '';
    if (type === 'exe') {
        cmd = basedir + start;
    } else if (type === 'jar') {
        cmd = 'java -jar ' + basedir + start;
    } else {
        res.send('the datamapping service has not been supported yet.');
    }

    // 参数
    var p = ' -r -f ' + srcPath + ' -n ' + nodename;

    //调用映射服务
    child_process.exec(cmd + p, { cwd: basedir }, function (err, data, stderr) {
        if (err) {
            console.log('getnode error: ' + err + ';' + stderr);
            res.send('-2');
            return;
        }
        res.send(data);
    });

};


// 显示运行实例界面
exports.showInstancePage = function (req, res, next) {
    // req.session.currentRouter = "/datamap/use";
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render('datamap/instancepage', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_0",
        'th_active': 'mapping_0_1'
    });
}


// 显示运行记录界面
exports.showRecordPage = function (req, res, next) {

    // req.session.currentRouter = "/datamap/use";
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render('datamap/recordpage', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_0",
        'th_active': 'mapping_0_2'
    });
}


// 显示运行结果页面
exports.showResPage = function (req, res, next) {
    // req.session.currentRouter = "/datamap/use";
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render('datamap/runres', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_0",
        'th_active': 'mapping_0_2'
    });
}

// 显示映射服务迁移页面
exports.showDatamapTransPage = function (req, res, next) {
    // req.session.currentRouter = "/datamap/use";
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render('datamap/transferpage', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_0",
        'th_active': 'mapping_0_0'
    });
}