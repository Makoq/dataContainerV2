var request = require('request');
var formidable = require('formidable');

// 获取文件选择器
exports.getFileManager = function (req, res, next) {
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

    res.render('rmt/user/rmt_filemanager', {
        "login": login,
        "username": username,
        "active": true,
        "subactive": "-1"
        //显示选择按钮，如果直接在detail页面中查看数据的话，是不需要显示选择按钮的。但是我们需要使用数据的时候，就需要显示选择按钮，以确定用户所选择的文件。
    });
}

// // 远程上传数据
// exports.uploadfile = function (req, res, next) {
//     // 当远程请求时，该值为undefined
//     //var username = req.session.username;//当前用户名

//     var form = new formidable.IncomingForm();
//     form.uploadDir = __dirname + '/../../tmp';

//     form.parse(req, function (err, fields, files) {
//         //   console.log(files);
//         if (err) {
//             console.log(err);
//             res.send('-3');
//             return;
//         }

//         // 远程用户名，格式：rmt_username
//         var username = fields.username;
//         var parentid = fields.parentid;

//         var filename = files.file.name;//文件原来的名字
//         var filepath = files.file.path;//上传文件的路径+临时文件名

//         var foldpath = __dirname + '/../../upload/userdata/' + username;

//         fs.exists(foldpath, function (exists) {
//             //若不存在，创建用户文件夹
//             if (!exists) {
//                 file.mkdir(foldpath);
//             }
//             //用户id
//             var oid = new ObjectID();
//             var newpath = foldpath + '/' + oid; //文件的oid作为文件的唯一标识

//             // 文件重命名
//             fs.rename(filepath, newpath, function (err) {
//                 if (err) {
//                     console.log(err);
//                     res.send("-1");
//                     return;
//                 }

//                 //获取系统时间
//                 //保存数据库
//                 var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
//                 var size = parseFloat(files.file.size) / 1024;
//                 if (size < 1024) {
//                     size = Math.ceil(size) + ' KB';
//                 } else if (size < 1024 * 1024) {
//                     size = Math.ceil(size / 1024) + ' M';
//                 } else if (size < 1024 * 1024 * 1024) {
//                     size = Math.ceil(size / 1024 / 1024) + ' G';
//                 } else {
//                     size = Math.ceil(size / 1024) + ' KB';
//                 }

//                 // 插入新的数据
//                 db.insertOne('userdata', {
//                     _id: ObjectID(oid), name: filename, format: 'file',
//                     datetime: time, size: size, creator: username, parentid: parentid, type: 'private', favoriteby: username
//                 }, function (err, result) {
//                     if (err) {
//                         res.send("-2");
//                         return;
//                     }
//                     res.send(oid);//上传成功
//                 });
//             });
//         });
//     });
// }


// 获取用户数据
exports.getFiles = function (req, res, next) {
    var parentid = req.query.parentid; // 加载首页时，parentid = 1
    var username = req.session.username;
    var pageamount = req.query.pageamount === undefined ? 10 : parseInt(req.query.pageamount);
    var page = parseInt(req.query.page) === undefined ? 0 : parseInt(req.query.page);
    var ip = req.query.ip;

    // 获取用户文件
    request.get({ url: 'http://' + ip + '/user/files', qs: { 'parentid': parentid, 'username': username, 'pageamount': pageamount, 'page': page } }, function (error, response, body) {
        if (error) {
            console.log('rmt get user data error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 上传数据
exports.uploadfile = function (req, res, next) {

    var parentid = req.query.pid;
    var ip = req.query.ip;


    // var form = new formidable.IncomingForm();

    // form.parse(req, function (err, fields, files) {
    //     var ip = fields.ip;
    //     if (err) {
    //         console.log(err);
    //         res.send('-1');
    //         return;
    //     }

    // 远程的需要传递用户名
    var username = req.session.username;

    // 将ajax请求直接转发给远程服务器
    req.pipe(request.post('http://' + ip + '/user/uploadfile?username=' + username + '&parentid=' + parentid, function (error, response, body) {
        if (error) {
            console.log('rmt upload img error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        } else {
            console.log('rmt upload img status code: ' + response.statusCode);
            return;
        }
    }));
    // });
}

// 检查同级目录下文件名是否名称重复
exports.checkRepeate = function (req, res, next) {
    var ip = req.query.ip;
    var filename = req.query.filename;
    var parentid = req.query.parentid;

    var username = req.session.username;

    // url编码
    request.get({ url: 'http://' + ip + '/user/checkRepeate', qs: { 'filename': encodeURIComponent(filename), 'parentid': parentid, 'username': username } }, function (error, response, body) {
        if (error) {
            console.log('check repeate error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 删除用户数据
exports.deleteUserData = function (req, res, next) {

    var ip = req.query.ip;
    var oid = req.query.oid;
    var format = req.query.format;
    var username = req.session.username;

    request.get({ url: 'http://' + ip + '/user/deleteUserData', qs: { 'oid': oid, 'format': format, 'username': username } }, function (error, response, body) {
        if (error) {
            console.log('delete user data error: ' + error);
            return;
        }
        if (response.statusCode === 200) {
            res.send(body);
        }
    });

}


// rename
exports.updatename = function (req, res, next) {

    var oid = req.query.oid;
    var newname = req.query.newname;
    var newtime = req.query.newtime;
    var ip = req.query.ip;

    request.get({ url: 'http://' + ip + '/user/updatename', qs: { 'oid': oid, 'newname': newname, 'newtime': newtime } }, function (error, response, body) {
        if (error) {
            console.log('rename error: ' + error);
            return;
        }
        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// add folder
exports.addFolder = function (req, res, next) {
    var ip = req.query.ip;
    var parentid = req.query.parentid;
    var foldername = req.query.foldername;
    var addTime = req.query.addTime;

    var username = req.session.username;

    request.get({ url: 'http://' + ip + '/user/addFolder', qs: { 'parentid': parentid, 'foldername': foldername, 'addTime': addTime, 'username': username } }, function (error, response, body) {
        if (error) {
            console.log('add folder error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 下载用户数据
exports.download = function (req, res, next) {
    var ip = req.query.ip;
    var filename = req.query.filename;
    // 当前用户（远程用户）
    var username = req.session.username;

    var localReq = request.get({ url: 'http://' + ip + '/user/download', qs: { 'filename': filename, 'username': username } }, function (error, response, body) {
        // if (error) {
        //     console.log('download file error: ' + error);
        //     return;
        // }

        // if (response.statusCode === 200) {
        //     // res.send(body);
        //     // res.end(body);
        //     res.set({
        //         'Content-Type': 'file/xml',
        //         'Content-Length': body.length
        //     });
        //     res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

        //     res.end(body);
        // }
    });

    req.pipe(localReq);
    localReq.pipe(res);
}


// 获取数据数目
exports.getFileCount = function (req, res, next) {

    var ip = req.query.ip;
    var parentid = req.query.parentid;
    var username = req.session.username;//远程用户必须带用户名。

    var url = 'http://' + ip + '/user/filecount';
    request.get({ url: url, qs: { parentid: parentid, username: username } }, function (error, response, body) {
        if(error){
            console.log('get rmt file count error: ' + error);
            res.send('-1');
            return;
        }

        if(response.statusCode === 200){
            res.send(body);
        }
    });
}