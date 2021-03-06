var formidable = require("formidable");
var db = require("../models/db.js");
// guid
var uuid = require('node-uuid');
var file = require('./file.js');
var sd = require('silly-datetime');
//var md5 = require("../models/md5.js");
//var path = require("path");
// var fs = require("fs");
// var gm = require("gm");
var user = require('./user.js');

var datamap = require("./datamap.js");
var refactor = require('./refactor.js');
var visualization = require('./visualization.js');
var data = require('./data.js');
var common = require('./common.js');

var sys = require('./sys.js');
var recycle = require('./recycle.js');

// dp
var dp =require('./dp');

// dps
var dps = require('./dps');


 

 


//datamap
exports.showMapPage = datamap.showMapPage;
exports.showUsePage = datamap.showUsePage;//显示使用界面
exports.getUdxSchema = datamap.getUdxSchema;//获取UdxSchema
exports.getNode = datamap.getNode;
exports.showInstancePage = datamap.showInstancePage;//显示运行实例界面
exports.showRecordPage = datamap.showRecordPage;//显示运行记录界面
exports.showResPage = datamap.showResPage;// 显示运行结果页面
exports.showDatamapTransPage = datamap.showDatamapTransPage;//显示映射服务迁移页面

//refactor
exports.showRefactorPage = refactor.showRefactorPage;
exports.showRefactorDetailPage = refactor.showRefactorDetailPage;
exports.getMethods = refactor.getMethods;//获取重构服务中的方法
exports.showRefactorUsePage = refactor.showRefactorUsePage;
exports.getParamSchema = refactor.getParamSchema;//获取指定参数的schema
exports.showAdvancePage = refactor.showAdvancePage;//显示高级玩家界面
exports.downloadAdvanceRes = refactor.downloadAdvanceRes;//下载串联运行的结果
exports.showRefactorInstancePage = refactor.showRefactorInstancePage;
exports.showRefactorRecordPage = refactor.showRefactorRecordPage;
exports.showRefactorResPage = refactor.showRefactorResPage;//显示重构运行结果页面
// exports.showAdvanceResPage = refactor.showAdvanceResPage;//显示高级操作结果例页面

// dp
exports.showBlockly = dp.showBlockly;

// dps
exports.showDPSPage = dps.showDPSPage;
exports.newDPSPage = dps.newDPSPage;
exports.showDPSInstances = dps.showDPSInstances;
exports.showDPSRecords = dps.showDPSRecords;
exports.showDPSResult = dps.showDPSResult;
exports.saveStub = dps.saveStub;
exports.getDPSStubs = dps.getDPSStubs;

// python中调用需要新生成一个输出数据的id
exports.getNewId = dps.getNewId;

//user
exports.showUserDetail = user.showUserDetail;
exports.uploadfile = user.uploadfile;//用户上传自己的私有数据
exports.deleteUserData = user.deleteUserData;
exports.getFileManager = user.getFileManager;
exports.selectService = user.selectService;
exports.getUserTags = user.getUserTags;//得到当前用户的tags信息
exports.getFiles = user.getFiles;
exports.addFolder = user.addFolder;
exports.updatename = user.updatename;//更新名字
exports.checkRepeate = user.checkRepeate;//检查同级目录下文件名称是否重复
exports.download = user.download;//下载输出数据
// 门户只获取数据
exports.getOnlyFiles = user.getOnlyFiles;
exports.getFileCount = user.getFileCount;
// 获取远程数据容器数据
exports.getRemoteUserData = user.getRemoteUserData;


//visualization
exports.showVisualPage = visualization.showVisualPage;
exports.showVisualizationUsePage = visualization.showVisualizationUsePage;
exports.getVisualizationSchemas  =visualization.getVisualizationSchemas;
exports.getSchema = visualization.getSchema;//获取可视化包中的schema

//data
exports.showDataPage = data.showDataPage;
exports.showUploadDataPage = data.showUploadDataPage;
exports.uploadData = data.uploadData;//只上传数据到临时目录
exports.saveDataInfo = data.saveDataInfo;//保存数据信息到数据库
exports.dataDownload = data.dataDownload;//下载数据


// common
exports.showDetailEdit = common.showDetailEdit; //显示数据映射服务详细内容编辑页面
exports.uploadDetailImage = common.uploadDetailImage; //图片上传测试
exports.getDetalImgs = common.getDetalImgs;
exports.saveDetail = common.saveDetail; //内容保存测试
exports.getDetailContent = common.getDetailContent;  //内容保存测试
exports.showDetails = common.showDetails; // 显示详情页面
// 获取服务个数
exports.getServiceCount = common.getServiceCount;
// 上传服务
exports.showUploadServicePage = common.showUploadServicePage;
exports.uploadService = common.uploadService;
// 删除服务
exports.deleteService = common.deleteService;
// 删除服务运行记录
exports.deleteServiceRecords = common.deleteServiceRecords;
// 切换服务状态
exports.switchServiceStatus = common.switchServiceStatus;
// 记录状态切换
exports.switchRecordsStatus = common.switchRecordsStatus;
// 获取服务
exports.getServices = common.getServices;
// 获取服务运行记录
exports.getServiceRecords = common.getServiceRecords;
// 向门户注册
exports.register2portal = common.register2portal;

// sys
exports.getSysStatus = sys.getSysStatus;

// 回收站
exports.showRecyclePage = recycle.showRecyclePage;




exports.showIndex = function (req, res, next) {
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

    res.render("index", {
        "login": login,
        "username": username,
        "active": "home",
        "subactive": "",
        "th_active": ""

        //"avatar": avatar    //登录人的头像
    });
}

exports.showLogin = function (req, res, next) {
    res.render("login", {
        // "login": false,
        // "username": ""
    });
}

exports.doLogin = function (req, res, next) {
    //得到用户表单
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        var username = fields.username;
        var password = fields.password;
        //var jiamihou = md5(md5(password) + "考拉");

        //查询数据库，看看有没有个这个人
        db.find("users", { "name": username }, function (err, result) {
            if (err) {
                res.send("-5"); //error
                return;
            }
            //console.log(result);
            //没有这个人
            if (result.length == 0) {
                res.send("-1"); //用户名不存在
                return;
            }
            //有的话，进一步看看这个人的密码是否匹配
            if (password == result[0].pwd) {
                req.session.login = "1";//往session中存登录成功的标识和用户名
                req.session.username = username;

                // res.send({
                //     state: "1",
                //      router: (req.session.currentRouter !== undefined)?req.session.currentRouter: "/"
                // })

                res.send("1");  //登陆成功
                return;
            } else {
                res.send("-2");;  //密码错误
                return;
            }
        });
    });
}
exports.showRegister = function (req, res, next) {
    res.render("register", { "login": false, "username": "", "active": "" });

}

exports.doRegister = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        var password = fields.password;
        var email = fields.email;
        //To check username exists or not.
        db.find("users", { "name": username }, function (err, result) {
            if (err) {
                res.send("error");
                return;
            }
            //not exist
            if (result.length == 0) {
                //write username and password to Database.   
                db.insertOne("users", { "name": username, "pwd": password }, function () {
                    //发送邮件测试
                    const nodemailer = require('nodemailer');
                    let transporter = nodemailer.createTransport({
                        service: 'qq',
                        secure: true,
                        auth: {
                            user: 'forrick@foxmail.com',
                            pass: 'wtctefggsxjubefd'
                        }
                    });
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: 'forrick@foxmail.com', // sender address
                        to: email, // list of receivers
                        subject: '账号激活', // Subject line
                        text: '请点击以下链接进行激活', // plain text body
                        html: '<p>Please click this link to </p><span><a href="http://223.2.47.235:8899/accounts/login">Activate</a> your  account</span>' // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.send(error);
                            return
                        }
                        res.send("1");
                        return
                    });

                });

            } else {
                res.send("-1");
                return;
            }
        });

    });



}

exports.checkUser = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username = fields.username;
        //To check username exists or not.
        db.find("users", { "name": username }, function (err, result) {
            if (err) {
                res.send("error");
                return;
            }
            //not exist
            if (result.length == 0) {
                res.send("true");
                return;
            } else {
                res.send("false");
                return;
            }

        });
    });
}

//退出
exports.doLoginout = function (req, res, next) {
    req.session.login = '-1';//未登录
    // req.seesion.username = "";//error  不能设置为undefined。奇怪了。。。

    //重定向
    res.redirect('/');
}

// **********************对接接口*********************************
// 获取访问码
exports.getAccessCode = function (req, res, next) {
    var uid = req.query.uid;//用户唯一标识

    if(uid === undefined){
        res.send('-3');
        return;
    }

    // 查询数据库看是否存在
    db.find('rmtuser', { uid: uid }, function (err, result) {
        if (err) {
            console.log(err);
            res.send('-1');
            return;
        }
        // 不存在
        if (result.length <= 0) {
            // 生成一个随机访问码
            var accesscode = uuid.v4();
            // 以accesscode作为本地文件夹的文件名，这样每次用户访问的是否必须都携带这个访问码，作为用户的唯一标识。
            var dir = __dirname + '/../upload/userdata/' + accesscode;
            // 创建本地用户文件夹
            file.mkdir(dir);
            // 存储到数据库中
            var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');  // 当前服务器时间
            var ip = req.rawHeaders[1];
            db.insertOne('rmtuser', { uid: uid, accesscode: accesscode,createtime:time,ip:ip }, function (error, results) {
                if (error) {
                    console.log(error);
                    res.send('-2');
                    return;
                }
                res.send(accesscode);
            });

        } else {
            res.send(result[0].accesscode);
        }
    });
}