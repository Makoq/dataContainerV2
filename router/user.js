var db = require("../models/db.js");
var ObjectID = require('mongodb').ObjectID;//数据库ObjectId

var file = require('./file.js');//模块中包含了fs
var fs = require('fs');
var sd = require('silly-datetime');

var formidable = require('formidable');
var settings = require("../settings.js");

var request = require('request');

//显示用户主页
exports.showUserDetail = function (req, res, next) {
    // req.session.currentRouter = "/user/detail";
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

    res.render('user/detail', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_0",
        'th_active': 'mapping_0_0'
    });
}

//获取用户个人数据
// exports.getUserData = function (req, res, next) {
//     if (req.session.login != "1") {//未登录
//         //重定向
//         res.redirect('/accounts/login');
//         return;
//     }
//     // 用户名
//     var username = req.session.username;
//     var pageamount = parseInt(req.query.pageamount);
//     var page = parseInt(req.query.page);

//     //根据用户名查找对应的数据。要求：用户名唯一。
//     db.find("userdata", { 'creator': username }, { "pageamount": pageamount, "page": page }, function (err, result) {
//         if (err) {
//             res.send('-1');//获取数据失败
//             return;
//         }
//         // console.log("get user data :\n" + result);
//         res.send(result);
//     });
// }

//获取指定数据
exports.getFiles = function (req, res, next) {
    // if (req.session.login != "1") {//未登录
    //     //重定向
    //     res.redirect('/accounts/login');
    //     return;
    // }

    var parentid = req.query.parentid; // 加载首页时，parentid = 1
    var username = req.session.username;
    // 如果不是 session中没有username，则是远程请求。
    if (username === undefined) {
        username = req.query.username;
    }

    var pageamount = req.query.pageamount === undefined ? 10 : parseInt(req.query.pageamount);
    var page = parseInt(req.query.page) === undefined ? 0 : parseInt(req.query.page);

    db.find("userdata", { 'creator': username, 'parentid': parentid }, { "pageamount": pageamount, "page": page, 'sort': { "datetime": -1 } }, function (err, result) {
        if (err) {
            res.send('-1');//获取数据失败
            return;
        }

        res.send(result);
    });
}


// 添加文件夹
exports.addFolder = function (req, res, next) {
    var foldername = req.query.foldername;//要往数据库中添加的文件夹名
    var addTime = req.query.addTime;//创建文件夹时间
    var parentid = req.query.parentid;//父节点

    var username = req.session.username;
    if (username === undefined) {
        username = req.query.username;
    }

    // 判断是否重复
    db.find('userdata', { 'creator': username, 'parentid': parentid, 'name': foldername }, function (error, result) {
        if (error) {
            console.log('add folder error: ' + error);
            res.send('-1');
            return;
        }

        // 重复
        if (result.length > 0) {
            res.send('1');
        } else {
            var oid = new ObjectID();

            // 插入数据
            db.insertOne('userdata', { '_id': ObjectID(oid), name: foldername, format: 'folder', parentid: parentid, datetime: addTime, creator: username, type: 'private', favoriteby: username }, function (err, results) {
                if (err) {
                    res.send("-2");
                    return;
                }
                res.send('ok|' + oid);//上传成功
            });
        }
    });
}

//更新名字
exports.updatename = function (req, res, next) {
    var oid = req.query.oid;
    var newname = req.query.newname;
    var newtime = req.query.newtime;

    db.updateMany('userdata', { _id: ObjectID(oid) }, { $set: { 'name': newname, 'datetime': newtime } }, function (err, results) {
        if (err) {
            console.log('update file or folder name error: ' + err);
            res.send('-1');
            return;
        }
        res.send('1');
    });
}

// 检查同级目录下名称是否重复
exports.checkRepeate = function (req, res, next) {
    // 即将要上传的文件的名字
    var filename = decodeURIComponent(req.query.filename);
    // 即将要上传的目录id
    var parentid = req.query.parentid;

    db.find('userdata', { 'name': filename, parentid: parentid }, function (err, result) {
        if (err) {
            res.send('-1');//获取数据失败
            return;
        }
        if (result.length > 0) {
            res.send('1');//重复
        } else {
            res.send('0');//不重复
        }
    });
}

// 用户上传数据
exports.uploadfile = function (req, res, next) {
    // 当远程请求时，该值为undefined
    var username = req.session.username;//当前用户名
    // 如果username为空，则是远程请求。则username应该是fileds对象中获取。
    if (username === undefined) {
        username = req.query.username;
    }
    // var parentid = req.query.parentid;

    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/../tmp';

    form.parse(req, function (err, fields, files) {

        if (err) {
            console.log(err);
            res.send('-3');
            return;
        }

        var parentid = fields.parentid;

        var filename = files.files.name;//文件原来的名字
        var filepath = files.files.path;//上传文件的路径+临时文件名

        var foldpath = __dirname + '/../upload/userdata/' + username;

        fs.exists(foldpath, function (exists) {
            //若不存在，创建用户文件夹
            if (!exists) {
                file.mkdir(foldpath);
            }
            //用户id
            var oid = new ObjectID();
            var newpath = foldpath + '/' + oid;  // 文件的oid作为文件的唯一标识

            // 文件重命名
            fs.rename(filepath, newpath, function (err) {
                if (err) {
                    console.log(err);
                    res.send("-1");
                    return;
                }

                //获取系统时间
                //保存数据库
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var size = parseFloat(files.files.size) / 1024;
                if (size < 1024) {
                    size = Math.ceil(size) + ' KB';
                } else if (size < 1024 * 1024) {
                    size = Math.ceil(size / 1024) + ' M';
                } else if (size < 1024 * 1024 * 1024) {
                    size = Math.ceil(size / 1024 / 1024) + ' G';
                } else {
                    size = Math.ceil(size / 1024) + ' KB';
                }

                // 插入新的数据
                db.insertOne('userdata', {
                    _id: ObjectID(oid), name: filename, format: 'file',
                    datetime: time, size: size, creator: username, parentid: parentid, type: 'private', favoriteby: username
                }, function (err, result) {
                    if (err) {
                        res.send("-2");
                        return;
                    }
                    res.send('ok');//上传成功
                });

            });
        });
    });
};

//删除数据 : 要根据 parentid 进行删除
exports.deleteUserData = function (req, res, next) {
    // 用户名唯一
    var username = req.session.username;//当前用户名

    if (username === undefined) {
        username = req.query.username;
    }

    // 文件名
    // var filename = paramObj.filename;
    // parentid
    // var parentid = paramObj.parentid;
    var oid = req.query.oid;
    var format = req.query.format;

    //删除数据库
    db.deleteMany('userdata', { _id: ObjectID(oid), creator: username }, function (err, result) {
        if (err) {
            console.log('delete file error' + err);
            res.send('-1');
            return;
        }

        if (format === 'Common File') {
            //删除本地数据
            //本地数据名称为当前数据的id
            var localfilename = __dirname + '/../upload/userdata/' + username + '/' + oid;
            try {
                fs.unlinkSync(localfilename);
            } catch (e) {
                console.log("delete file error: " + e);
                res.send('-2');
                return;
            }
        }
        res.send('1');//删除成功
    });
}

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

    res.render('user/filemanager', {
        "login": login,
        "username": username,
        "active": true,
        "subactive": "-1"
        //显示选择按钮，如果直接在detail页面中查看数据的话，是不需要显示选择按钮的。但是我们需要使用数据的时候，就需要显示选择按钮，以确定用户所选择的文件。
    });
}

// 显示用户选择数据的列表
exports.selectService = function (req, res, next) {
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

    res.render('common/getservices', {
        "login": login,
        "username": username,
        "active": true,
        "subactive": "-1"
        //显示选择按钮，如果直接在detail页面中查看数据的话，是不需要显示选择按钮的。但是我们需要使用数据的时候，就需要显示选择按钮，以确定用户所选择的文件。
    });
}

//得到当前用户的datamap的tags信息
exports.getUserTags = function (req, res, next) {
    var username = req.session.username;

    db.find('usertag', { user: username }, function (err, result) {
        if (err) {
            console.log('get user tag error: ' + err);
            res.send('-1');
            return;
        }
        if (result[0] === undefined) {
            res.send("");
        } else {
            res.send(result[0].tags);
        }

    });
}

//下载userdata
exports.download = function (req, res, next) {
    var username = req.session.username;//用户名

    // 远程用户
    if (username === undefined) {
        username = req.query.username;
    }

    var oid = req.query.filename;

    var filename = __dirname + '/../upload/userdata/' + username + '/' + oid;

    if (fs.existsSync(filename)) {

        // 查询数据库
        db.find('userdata', { _id: ObjectID(oid) }, function (err, result) {
            if (err) {
                console.log(err);
                res.send("the file is not exist");
                return;
            }

            var realName = result[0].name;

            var data = '';
            try {
                data = fs.readFileSync(filename);
            } catch (ex) {
                console.log('read file error: ' + ex);
                data = 'read file error';
            }
            res.set({
                'Content-Type': 'file/xml',
                'Content-Length': data.length
            });
            res.setHeader('Content-Disposition', 'attachment; filename=' + realName);

            res.end(data);
        });

    } else {
        res.send('the file is not exist.');
    }
}


// 门户只获取数据
exports.getOnlyFiles = function (req, res, next) {
    var username = req.query.username;

    var username = req.session.username;
    // 如果不是 session中没有username，则是远程请求。
    if (username === undefined) {
        username = req.query.username;
    }

    db.find("userdata", { 'creator': username }, { 'sort': { "datetime": -1 } }, function (err, result) {
        if (err) {
            res.send('-1');//获取数据失败
            return;
        }

        res.send(result);
    });
}

// 获取files个数，用于分页
exports.getFileCount = function (req, res, next) {
    var parentid = req.query.parentid;
    var username = req.session.username;
    if (username === undefined) {
        username = req.query.username;
    }

    db.getCount("userdata", { parentid: parentid, creator: username }, function (count) {
        res.send(count + '');
    });
}

// 获取远程数据服务容器数据
exports.getRemoteUserData = function (req, res, next) {

    var gdid = req.query.gdid;
    var host = req.query.host;
    var port = req.query.port;
    var posType = req.query.posType; // LOCAL | MODEL_SERVICE | DATA_SERVICE
    var filename = req.query.fname;
    var username = req.query.username;//
    var oid = req.query.oid;

    var url = '';
    if (posType === 'LOCAL' || posType === 'MODEL_SERVICE') {
        url = 'http://' + host + ':' + port + '/geodata/' + gdid;
    } else if (posType === 'DATA_SERVICE') {
        url = 'http://' + settings.host + ':' + settings.port + '/user/download?filename=' + oid;
    }

    request.get({ url: url, qs: {} }, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }

        if (response.statusCode === 200) {

            // 请求之前先判断是否有这个文件
            db.find('userdata', { _id: ObjectID(oid) }, function (e, result) {
                if (e) {
                    console.log(e);
                    return;
                }

                // 之前没有
                if (result.length <= 0) {
                    // 保存数据
                    try {
                        fs.writeFileSync(__dirname + '/../upload/userdata/' + username + '/' + oid, body, 'utf-8');
                        var stat = fs.statSync(__dirname + '/../upload/userdata/' + username + '/' + oid);

                        //获取系统时间
                        //保存数据库
                        var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                        var size = parseFloat(stat.size) / 1024;
                        if (size < 1024) {
                            size = Math.ceil(size) + ' KB';
                        } else if (size < 1024 * 1024) {
                            size = Math.ceil(size / 1024) + ' M';
                        } else if (size < 1024 * 1024 * 1024) {
                            size = Math.ceil(size / 1024 / 1024) + ' G';
                        } else {
                            size = Math.ceil(size / 1024) + ' KB';
                        }

                        // 插入新的数据
                        db.insertOne('userdata', {
                            _id: ObjectID(oid), name: filename, format: 'file',
                            datetime: time, size: size, creator: username, parentid: '598844df055f5749846f44fc', type: 'private', favoriteby: username
                        }, function (err, result) {
                            if (err) {
                                // res.send("-2");
                                console.log('insert to db error： ' + err);
                                return;
                            }
                        });

                    } catch (e) {
                        console.log("failed to write file which is from remote" + e);
                        return;
                    }
                }

            });

        }

        res.send('ok');//上传成功
    });
}