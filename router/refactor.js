var formidable = require("formidable");
var db = require("../models/db.js");
var ObjectID = require('mongodb').ObjectID;//数据库ObjectId
var sd = require('silly-datetime');
var fs = require('fs');

var child_process = require('child_process');

//显示重构的页面
exports.showRefactorPage = function (req, res, next) {
    // req.session.currentRouter = "/refactor";
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

    res.render('refactor/refactorpage', {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_0",
        'th_active': 'dp_0_1'
    });
}

//显示refactor一般服务的方法页面
exports.showRefactorDetailPage = function (req, res, next) {

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

    res.render('refactor/detailpage', {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_0",
        'th_active': 'dp_0_0'
    });
}

//获取重构服务中的方法
exports.getMethods = function (req, res, next) {
    var serviceId = req.query.id;

    //methods.xml/methods.json中记录着所有的方法信息
    var filepath = __dirname + "/../upload/dp/" + serviceId + "/methods.json";

    //读取xml文件，转成json
    var json_string = fs.readFileSync(filepath, "utf-8"); //同步读取文件的方法

    res.send(json_string);
}


//显示方法库中具体方法的使用界面
exports.showRefactorUsePage = function (req, res, next) {
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

    res.render('refactor/usepage', {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_0",
        'th_active': 'dp_0_0'
    });
}

//获取指定方法指定参数的schema
exports.getParamSchema = function (req, res, next) {
    var paramObj = req.query;

    var serviceId = paramObj.id;
    var schema = paramObj.schema;//Schema的路径
    var iotype = paramObj.iotype;

    if (schema == "") {
        res.send("");
        return;
    }

    var schemaPath = __dirname + "/../upload/dp/" + serviceId + "/" + schema;

    var udxSchema = fs.readFileSync(schemaPath,'utf-8');

    if (iotype === 'in') {
        res.send(udxSchema);
    } else {
        //对于输出参数，要返回一个oid，作为输出文件的文件名
        res.send(udxSchema + '[~]' + new ObjectID());
    }
}

//显示高级玩家界面
exports.showAdvancePage = function (req, res, next) {
    //  req.session.currentRouter = "/refactor/advance";
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

    res.render('refactor/advance', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_0",
        'th_active': 'refactor_0_3'

    });
}

// 下载串联运行的结果
exports.downloadAdvanceRes = function (req, res, next) {
    var filename = req.query.filename; //要下载的文件名拼接起来的字符串
    var username = req.session.username;

    var downloadPath = __dirname + '/../upload/userdata/' + username + '/' + filename;

    var data = null;
    try {
        data = fs.readFileSync(downloadPath);
    } catch (e) {
        console.log("error read advance call output file error : " + e);
        res.send('-1');
        data = null;
        return;
    }

    res.set({
        'Content-Type': 'file/xml',
        'Content-Length': data.length
    });
    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

    res.end(data);
}

// 显示运行实例页面
exports.showRefactorInstancePage = function (req, res, next) {
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

    res.render('refactor/instance', {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_1",
        'th_active': 'dp_0_1'
    });
}

// 显示运行记录页面
exports.showRefactorRecordPage = function (req, res, next) {
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

    res.render('refactor/record', {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_2",
        'th_active': 'dp_2_0'
    });
}

// 显示重构运行结果页面
exports.showRefactorResPage = function (req, res, next) {
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

    res.render('refactor/result', {
        "login": login,
        "username": username,
        "active": "dp",
        "subactive": "dp_2",
        'th_active': 'dp_2_0'
    });
}
