var db = require("../models/db.js");
var ObjectID = require('mongodb').ObjectID;//数据库ObjectId
var formidable = require('formidable');
var fs = require('fs');
var unzip = require("unzip");//解压缩
var xml2js = require('xml2js');
var file = require('./file.js');
var sd = require('silly-datetime');
var settings = require('../settings');
var request = require('request');
var uuid = require('node-uuid');

////显示数据映射服务详细内容编辑页面
exports.showDetailEdit = function (req, res, next) {
    var login = false;
    var username = "";
    if (req.session.login !== "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    } else if (req.session.login == "1") {
        //如果登陆了
        username = req.session.username;
        login = true;
    }

    var stype = req.query.type;//服务类型
    var level1 = '', level2 = '', level3 = '';
    if (stype === 'data') {
        level1 = "dataservice";
        level2 = "dataservice_0";
        level3 = 'dataservice_0_0';
    } else if (stype === 'datamap') {
        level1 = "dp";
        level2 = "dp_0";
        level3 = 'dp_0_0';
    } else if (stype === 'refactor') {
        level1 = "dp";
        level2 = "dp_0";
        level3 = 'dp_0_1';
    }

    res.render('common/detail_edit', {
        "login": login,
        "username": username,
        "active": level1,
        "subactive": level2,
        'th_active': level3
    });
}

// 上传详情页面的图片
exports.uploadDetailImage = function (req, res, next) {
    //服务名称
    var sid = req.query.sid;
    var type = req.query.type;//服务类型

    var ip = req.headers.host;

    var form = new formidable.IncomingForm();
    // 上传临时目录
    form.uploadDir = __dirname + '/../tmp';

    form.parse(req, function (err, fields, files) {

        var path = files["editormd-image-file"].path;
        var arr = path.split('\\');
        var filename = arr[arr.length - 1];
        var basedir = __dirname + '/../upload/' + type + '/' + sid + '/images/';
        var newpath = basedir + filename;

        if (!fs.existsSync(basedir)) {
            fs.mkdirSync(basedir);
        }

        // 文件重命名
        fs.rename(path, newpath, function (err2) {
            if (err2) {
                console.log(err2);
                res.send("-1");
                return;
            }

            res.send({
                success: 1,           // 0 表示上传失败，1 表示上传成功
                message: "upload successfully",
                url: 'http://' + ip + '/common/detail/img?sid=' + sid + '&filename=' + filename + '&type=' + type        // 上传成功时才返回
            });
        });

        // var defaultPath = "/images/datamap/asciigrid.jpg";
    });
}

// 获取详情页的图片
exports.getDetalImgs = function (req, res, next) {
    var filename = req.query.filename;
    var sid = req.query.sid;
    var type = req.query.type;//服务类型，既是数据库名字，又是服务本地文件夹名字

    var filepath = __dirname + '/../upload/' + type + '/' + sid + '/images/' + filename;
    var defaultPath = __dirname + '/../public/images/logo.png';
    var defaultImg = fs.readFileSync(defaultPath);// 读取默认图片

    //返回图片的base64位编码
    try {
        var imageBuf = fs.readFileSync(filepath);
    } catch (err) {
        console.log('read ' + type + ' snapshot error : ' + err);
        //给一个默认图片
        // res.send('/images/logo.png');
        res.end(defaultImg);
    }
    if (imageBuf === undefined) {
        // res.send('/images/logo.png');
        res.end(defaultImg);
    } else {
        //var imgData = imageBuf.toString('base64');
        //res.send('data:image/jpg;base64,'+imgData);
        res.end(imageBuf);
    }
}

// 保存服务详情到数据库
exports.saveDetail = function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var content = fields.data;//
        var sid = fields.sid;//服务id
        var type = fields.type;//服务的类型

        db.updateMany(type, { _id: ObjectID(sid) }, { $set: { 'details': content } }, function (err, result) {
            if (err) {
                console.log('save ' + type + ' detail error: ' + err);
                res.send('-1');
                return;
            }
            res.send('1');
        });
        // var SavePath = __dirname + '/../tmp/tmp.txt';
        // fs.writeFile(SavePath, content, function (err) {
        //     if (err) {
        //         res.send("-2");
        //         throw err;
        //     }
        //     res.send("1");
        // });
    });
}

// 从数据库读取服务描述
exports.getDetailContent = function (req, res, next) {
    var sid = req.query.sid;
    var type = req.query.type; // 说明是哪个服务的详情

    db.find(type, { _id: ObjectID(sid) }, function (err, result) {
        if (err) {
            console.log('can not read the details for the ' + type + ': ' + err);
            res.send('-1');
            return;
        }
        res.send(result[0].details);
    });

    //  var ReadPath = __dirname + '/../tmp/tmp.txt';
    //  fs.readFile(ReadPath,"utf8",function (error,data){
    //  if(error) throw error ;
    //  res.send(data);
    //  }) ;
}

//数据服务详细页面
exports.showDetails = function (req, res, next) {
    // req.session.currentRouter = "/datamap/detail";
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

    var stype = req.query.type;//服务类型
    var level1 = '', level2 = '', level3 = '';
    if (stype === 'data') {
        level1 = "dataservice";
        level2 = "dataservice_0";
        level3 = 'dataservice_0_0';
    } else if (stype === 'datamap') {
        level1 = "dp";
        level2 = "dp_0";
        level3 = 'dp_0_0';
    } else if (stype === 'dp') {
        level1 = "dp";
        level2 = "dp_0";
        level3 = 'dp_0_1';
    }

    res.render('common/detail', {
        "login": login,
        "username": username,
        "active": level1,
        "subactive": level2,
        'th_active': level3
    });
}

// 获取服务个数
exports.getServiceCount = function (req, res, next) {
    var sname = req.query.stype;
    db.getAllCount(sname, function (count) {
        res.send(count + '');
    });
}


// 显示上传服务页面
exports.showUploadServicePage = function (req, res, next) {
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

    var stype = req.query.type;//服务类型
    var level1 = '', level2 = '', level3 = '';
    if (stype === 'dp') {
        level1 = "dp";
        level2 = "dp_0";
        level3 = 'dp_0_0';
    } else if (stype === 'refactor') {
        level1 = "dp";
        level2 = "dp_0";
        level3 = 'dp_0_1';
    }else{
        level1 = "dataservice";
        level2 = "dataservice_0";
        // level3 = 'refactor_0_4';
    }

    res.render('common/uploadzip', {
        "login": login,
        "username": username,
        "active": level1,
        "subactive": level2,
        'th_active': level3
    });
}


// 上传服务
exports.uploadService = function (req, res, next) {

    var type = req.query.type;

    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../tmp';

    form.parse(req, function (err, fields, files) {
        // 生成一个ObjectId，作为该datamap的服务id
        // upload zip file
        if (JSON.stringify(fields) == "{}") {
            var sId = new ObjectID();

            // 解压缩
            // console.log(files.files.path);
            try {
                var basedir = __dirname + '/../upload/' + type + '/'; // 例如： xx/xxx/datamap/  
                fs.createReadStream(files.files.path).pipe(unzip.Extract({ path: basedir + sId })).on('close', function () {
                    
                    var guid = uuid.v4();// v4随机生成，v1基于时间戳
                    res.send(sId + '_ok_' + guid);
                });

            } catch (e) {
                console.log('unzip error: ' + e);
                res.send('-1');
            }
        } else {//upload information about the datamap zip file

            var uName = fields.uName;
            var uEmail = fields.uEmail;

            var sName = fields.s_name;
            var sDescription = fields.s_description;
            var sSnapshot = fields.s_snapshot; // 快照的base64编码数据 
            // var sTags = fields['s_tags[]'];//tags
            // var sAuthorizationMode = fields.s_authorizationMode;
            var available = fields.s_authority;
            var sId = fields.s_id;//当前服务id
            var uid = fields.uid;//当前映射服务的uid

            // 用户如果没有选择图片，则使用默认图片
            if (sSnapshot === undefined) {
                var imageBuf = fs.readFileSync(__dirname + '/../public/images/logo.png');
                sSnapshot = 'data:image/png;base64,' + imageBuf.toString("base64");
            }

            var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
            //保存信息到数据库。
            db.insertOne(type, {
                '_id': ObjectID(sId), 'name': sName, 'description': sDescription, uname: uName, uemail: uEmail,
                'author': req.session.username, 'datetime': time, 'snapshot': sSnapshot,
                'available': available, 'details': "", uid: uid, associate: '-1', delete: '-1', deletetime: ''
            }, function (err, result) {
                if (err) {
                    console.log('upload ' + type + ' err: ' + err);
                    res.send('-3');
                }
                // 上传数据+保存到数据库成功。
                res.send('1');
            });
        }
    });
}

// 删除服务
exports.deleteService = function (req, res, next) {
    var sid = req.query.id;
    var type = req.query.type;  // 服务类型： data、datamap、refactor

    // 设置删除标识
    db.updateMany(type, { _id: ObjectID(sid) }, { $set: { 'delete': '1', 'deletetime': sd.format(new Date(), 'YYYY-MM-DD HH:mm') } }, function (err, result) {
        if (err) {
            console.log('delete ' + type + ' service error: ' + err);
            res.send('-1');
            return;
        }
        // res.redirect(req.headers.referer);
        // res.redirect('/' + type);
        res.send('1');
    });

}


// 删除服务运行记录
exports.deleteServiceRecords = function (req, res, next) {
    var guid = req.query.guid;
    var type = req.query.type;  // 服务类型： data、datamap、refactor

    var docName = '';
    if (type === 'datamap') {
        docName = 'mappingrecord';
    } else if (type === 'refactor') {
        docName = 'refactorrecord';
    } else if (type === 'refactor_advance') {
        docName = 'refactoradvancerecord';
    }

    // 设置删除标识
    db.updateMany(docName, { guid: guid }, { $set: { 'delete': '1', 'deletetime': sd.format(new Date(), 'YYYY-MM-DD HH:mm') } }, function (err, result) {
        if (err) {
            console.log('delete ' + type + ' service error: ' + err);
            res.send('-1');
            return;
        }
        // if (type === 'datamap') {
        //     res.redirect('/datamap/record');
        // } else if (type === 'refactor' || type === 'refactor_advance') {
        //     res.redirect('/refactor/record');
        // }
        //res.redirect(req.headers.referer);
        res.send('1');
    });
}

// 切换服务状态
exports.switchServiceStatus = function (req, res, next) {
    var type = req.query.type;//哪个服务：data / datamap / refactor
    var sid = req.query.id; // 服务id
    var status = req.query.status;//哪个状态
    var tostatus = req.query.tostatus;//要切换成的状态

    db.updateMany(type, { _id: ObjectID(sid) }, { $set: { [status]: tostatus } }, function (err, result) {
        if (err) {
            console.log("failed to switch " + type + " service " + status + " status.: " + err);
            res.send('-1');
            return;
        }
        res.send('1');
    });
}

// 记录状态切换
exports.switchRecordsStatus = function (req, res, next) {
    var type = req.query.type;//哪个服务：data / datamap / refactor
    var guid = req.query.guid; // 那个服务记录：guid标识
    var status = req.query.status;//哪个状态
    var tostatus = req.query.tostatus;//要切换成的状态

    var docName = '';
    if (type === 'datamap') {
        docName = 'mappingrecord';
    } else if (type === 'refactor') {
        docName = 'refactorrecord';
    } else if (type === 'refactor_advance') {
        docName = 'refactoradvancerecord';
    }

    db.updateMany(docName, { guid: guid }, { $set: { [status]: tostatus } }, function (err, result) {
        if (err) {
            console.log("failed to switch " + type + " service " + status + " status.: " + err);
            res.send('-1');
            return;
        }
        res.send('1');
    });
}

// 获取服务
exports.getServices = function (req, res, next) {
    var type = req.query.type;//服务类型
    var paramJson = req.query;

    //var param =  req.params.name;//get按照{}传递参数，req.params获取不到
    var pageamount = parseInt(paramJson.pageamount);//每页的行数
    var page = parseInt(paramJson.page);//第几页
    var ids = paramJson.ids;
    var isdelete = paramJson.delete === undefined ? '-1' : paramJson.delete; // 1 已删除   -1  未删除

    var findConditioin = new Array();

    if (ids == "all") {//查询全部
        findConditioin.push({});
    } else if (ids instanceof Array) {
        for (var i = 0; i < ids.length; i++) {
            findConditioin.push({ "_id": ObjectID(ids[i]) });
        }
    }

    // 排序  "sort":{"name":1}
    db.find(type, { "$or": findConditioin, delete: isdelete }, { "pageamount": pageamount, "page": page, "sort": { "datetime": 1 } }, function (err, result) {
        if (err) {
            console.log(err);
            res.send('-1');//获取数据失败
            return;
        }
        res.send(result);
    });
}

// 获取服务运行记录
exports.getServiceRecords = function (req, res, next) {
    var type = req.query.type;//服务类型

    var pageamount = parseInt(req.query.pageamount);
    var page = parseInt(req.query.page);
    var guid = req.query.guid;
    var isdelete = req.query.delete === undefined ? '-1' : req.query.delete; // 1 已删除   -1  未删除

    var condition = { delete: isdelete };
    if (guid != undefined) {
        condition = { guid: guid, delete: isdelete };
    }

    var docName = '';
     if (type === 'dp') {
        docName = 'dprecord';
    } else if (type === 'dps') {
        docName = 'dpsrecord';
    }

    db.find(docName, condition, { pageamount: pageamount, page: page, sort: { "starttime": -1 } }, function (err, result) {
        if (err) {
            console.log('failed to read record info : ' + err);
            res.send('-1');
            return;
        }
        res.send(result);
    });
}

// 向门户注册
exports.register2portal = function (req, res, next) {
    var type = req.query.type; //服务类型
    var sid = req.query.sid; // 服务id
    var uid = req.query.uid; // 服务uid
    var sname = req.query.sname; // 服务的名字。用于在门户显示对应计算节点
    var action = req.query.action;//1  注册   -1 取消注册
    var portal_type = '';

    if (type === 'datamap') {
        portal_type = 'dataMapping';
    } else if (type === 'refactor') {
        portal_type = 'dataRefactor';
    }

    // 发送远程服务
    var url = 'http://' + settings.portalhost + ':' + settings.portalport + '/GeoModeling/registerDataServlet';

    // 传递ip地址的原因是因为：本地的远程机器也是通过本机注册的，这样远程的ip需要手动传递，而不能在门户通过req获取，否则拿到的都是本地ip
    request.get({ url: url, qs: { gid: uid, sname: encodeURIComponent(sname), action: action, collName: portal_type, sid: sid, host: settings.host, port: settings.port } }, function (error, response, body) {
        if (error) {
            console.log('rmt register error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            // res.send(body);
            var associate = '-1';
            if (body === '0') {//已经注册过了
                associate = '1';
            } else if (body === '2') {// 取消成功
                associate = '-1';
            } else if (body === '1') { // 注册成功
                associate = '1';
            }

            db.updateMany(type, { uid: uid }, { $set: { associate: associate } }, function (err, result) {
                if (err) {
                    console.log("switch " + type + " service status error: " + err);
                    res.send('-1');
                    return;
                }
                res.send('1');
            });
        } else {
            res.send('-1');
        }
    });
}