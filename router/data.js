var formidable = require('formidable');
var ObjectID = require('mongodb').ObjectID;//数据库ObjectId
var sd = require('silly-datetime');
var db = require("../models/db.js");
var fs = require('fs');
var file = require('./file.js');
// 压缩文件
var archiver = require('archiver');
var child_process = require('child_process');

exports.showDataPage = function (req, res, next) {
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    // req.session.currentRouter = "/data";
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render("data/datapage", {
        "login": login,
        "username": username,
        "active": "dataservice",
        "subactive": "dataservice_0",
        'th_active': 'dataservice_0_0'
    });
}


//显示上传数据界面
exports.showUploadDataPage = function (req, res, next) {
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

    res.render("data/uploaddata", {
        "login": login,
        "username": username,
        "active": "dataservice",
        "subactive": "dataservice_0",
        'th_active': 'dataservice_0_0'
    });

}

// 上传数据
exports.uploadData = function (req, res, next) {
    //用户名唯一
    // var username = req.session.username;//当前用户名

    var form = new formidable.IncomingForm();
    //先上传到临时目录
    form.uploadDir = __dirname + '/../tmp';

    form.parse(req, function (err, fields, files) {

        var filename = files.files.name; // 文件原来的名字
        var filepath = files.files.path; // 上传文件的路径+临时文件名

        res.send(filepath + '[$]' + filename);
    });
}


//保存数据信息到数据库
exports.saveDataInfo = function (req, res, next) {
    // 'uName': $('#u_name').val(),
    // 'uEmail': $('#u_email').val(),
    // 'dName': $('#d_name').val(),
    // 'dDescription': $('#d_description').val(),
    // 'dAuthority': d_authority,
    // "dSnapshot": $('#snapshot').attr('src'),//img base64
    // 'dFiles': allData

    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../tmp';

    form.parse(req, function (err, fields, files) {
        var uName = fields.uName;
        var uEmail = fields.uEmail;
        var dName = fields.dName;
        var dDescription = fields.dDescription;
        // var dTags = fields['dTags[]'];
        // var dGenTime = fields.dGenTime;
        // var dPropertyOwner = fields.dPropertyOwner;
        // var dRemarkers = fields.dRemarkers;
        // var dAuthorizationMode = fields.dAuthorizationMode;
        var available = fields.dAuthority;
        var dSnapshot = fields.dSnapshot;
        var dFiles = fields['dFiles[]'];

        // 用户如果没有选择图片，则使用默认图片
        if (dSnapshot === undefined) {
            var imageBuf = fs.readFileSync(__dirname + '/../public/images/logo.png');
            dSnapshot = 'data:image/png;base64,' + imageBuf.toString("base64");
        }

        // 从tmp目录中将数据移到data目录中
        var did = new ObjectID();

        // var base64Data = dSnapshot.replace(/^data:image\/\w+;base64,/, "");
        // var dataBuffer = new Buffer(base64Data, 'base64');

        // var sSnapshotType = 'jpg';
        // //获取图片格式
        // dSnapshot.replace(/^data:image\/\w+;base64,/, function (s, value) {
        //     sSnapshotType = s.split(';')[0].split('/')[1];
        // });

        var foldpath = __dirname + '/../upload/data/' + did;
        file.mkdir(foldpath); //若不存在，创建用户文件夹


        // try {
        //     fs.writeFileSync(foldpath + "/snapshot." + sSnapshotType, dataBuffer);
        // } catch (e) {
        //     console.log('save snapshot error:' + e);
        //     res.send('-3');
        //     return;
        // }

        (function iteration(i) {
            if (i == dFiles.length) {
                // save db
                db.insertOne('data', {
                    _id: did, name: dName, description: dDescription, author: req.session.username, uname: uName, uemail: uEmail,
                    snapshot: dSnapshot, available: available, datetime: sd.format(new Date(), 'YYYY-MM-DD HH:mm'), 'details': '', associate: '-1', delete: '-1'
                }, function (err, result) {
                    if (err) {
                        console.log('data info db insert error' + err);
                        res.send("-2");
                        return;
                    }
                    res.send('ok');//上传成功
                });
                return;
            }

            var realName = dFiles[i].split('[$]')[1];
            var savePath = foldpath + '/' + realName;
            // 文件重命名
            fs.rename(dFiles[i].split('[$]')[0], savePath, function (err) {
                if (err) {
                    console.log('data rename error： ' + err);
                    res.send("-1");
                    return;
                }
                iteration(i + 1);
            });
        })(0);
        // });
    });
}

// 下载数据
exports.dataDownload = function (req, res, next) {
    var did = req.query.id;

    db.find('data', { _id: ObjectID(did) }, function (err, result) {
        if (err) {
            console.log(err);
            res.send('-1');
            return;
        }
        if (result.length <= 0) {
            res.send('the data does not exit.');
        }
        //res.send(result.available);
        if (result[0].available == '-1') {
            res.send('the data can not be download.');
        } else if (result[0].available == '1') {
            // 下载数据
            var path = __dirname + '/../upload/data/' + did + '/';
            var tmppath = __dirname + '/../tmp/' + did + '.zip';

            var output = fs.createWriteStream(tmppath);
            var archive = archiver('zip');

            archive.on('error', function (err) {
                console.log(err);
                res.send('-1');
                return;
            });

            archive.pipe(output);
            // archive.bulk([
            //     { src: [path] }
            // ]);
            archive.directory(path, false);

            archive.finalize();

            output.on('close', function () {
                // console.log(archive.pointer() + ' total bytes');
                // console.log('archiver has been finalized and the output file descriptor has closed.');
                var data = fs.readFileSync(tmppath);

                res.set({
                    'Content-Type': 'file/xml',
                    'Content-Length': data.length
                });
                res.setHeader('Content-Disposition', 'attachment; filename=' + did + '.zip');

                fs.unlink(tmppath);

                res.end(data);
            });
        }
    });
}