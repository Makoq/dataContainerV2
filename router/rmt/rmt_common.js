// ********************详情***********************
var request = require('request');
var formidable = require('formidable');

// 获取存储在数据库的详情数据
exports.getDetailContent = function (req, res, next) {
    var sid = req.query.sid;
    var ip = req.query.ip;
    var type = req.query.type;

    // 请求远程服务器
    request.get('http://' + ip + '/common/detailcontent?sid=' + sid + '&type=' + type, function (error, response, body) {
        if (error) {
            console.log('get ' + type + ' details error: ' + error);
            return;
        }

        res.send(body);
    });
}

// 显示详情页面
exports.showDetails = function (req, res, next) {
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

    var stype = req.query.type;//服务类型
    var level1 = '', level2 = '', level3 = '';
    if (stype === 'data') {
        level1 = "dataservice";
        level2 = "dataservice_1";
        level3 = 'dataservice_0_0';
    } else if (stype === 'datamap') {
        level1 = "mapping";
        level2 = "mapping_1";
        level3 = 'mapping_1_0';
    } else if (stype === 'refactor') {
        level1 = "refactor";
        level2 = "refactor_1";
        level3 = 'refactor_1_0';
    }

    res.render('rmt/common/detail', {
        "login": login,
        "username": username,
        "active": level1,
        "subactive": level2,
        'th_active': level3
    });
}


// 显示详情编辑页面
// 废弃，远程没有编辑的页面
exports.showDetailEdit = function (req, res, next) {
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

    res.render('rmt/common/detail_edit', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_1",
        'th_active': 'mapping_1_0'
    });
}

// 上传详情图片
exports.uploadDetailImage = function (req, res, next) {
    var sid = req.query.sid;
    var type = req.query.type;
    var ip = req.query.ip;


    // 将ajax请求直接转发给远程服务器
    req.pipe(request.post('http://' + ip + '/common/detail/images?sid=' + sid + '&type=' + type, function (error, response, body) {
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

    // 要上传的表单数据
    // var formData = {
    //     // Pass a simple key-value pair
    //     sid: sid,
    //     type: type, // 文件上传到远程服务器的目录，默认-1，表示根目录
    //     file: fs.createReadStream(path)
    // };

    // 上传至远程数据库
    // request.post({ url: 'http://' + ip + '/rmt/user/uploadfile', formData: formData }, function (err, httpResponse, body) {
    //     if (err) {
    //         return console.error('upload failed:', err);
    //     }
    //     //console.log('Upload successful!  Server responded with:', body);

    //     console.log(body);
    //     var newoid = body;

    //     //2. 执行查询
    //     // url: /rmt/datamap/getNode
    //     request('http://' + ip + '/datamap/use/getNode?id=' + id + '&nodename=' + nodename + '&oid=' + newoid + '&username=rmt_' + req.session.username, function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             console.log(body) // Show the HTML for the baidu homepage.
    //         }
    //     });
    // });
}




// 保存详情到数据库
exports.saveDetail = function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var content = fields.data;//
        var sid = fields.sid;//服务id
        var type = fields.type;//服务的类型
        var ip = fields.ip;

        var formData = {
            // Pass a simple key-value pair
            sid: sid,
            data: content,
            type: type // 文件上传到远程服务器的目录，默认-1，表示根目录

        };

        // 上传至远程数据库
        request.post({ url: 'http://' + ip + '/common/detail/save', formData: formData }, function (err, httpResponse, body) {
            if (err) {
                return console.error('save rmt detail error:', err);
            }

            if (httpResponse.statusCode === 200) {
                res.send(body);
            }
        });

    });
}

// 获取服务
exports.getServices = function (req, res, next) {
    var ip = req.query.ip;
    var type = req.query.type;//服务类型
    var pageamount = req.query.pageamount;
    var page = req.query.page;
    var ids = req.query.ids;
    var isdelete = req.query.delete === undefined ? '-1' : req.query.delete; // 1 已删除   -1  未删除


    request.get({ url: 'http://' + ip + '/common/services', qs: { type: type, pageamount: pageamount, page: page, ids: ids, delete: isdelete } }, function (error, response, body) {
        if (error) {
            console.log('get rmt data services error: ' + error);
            return;
        }
        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 获取远程记录
exports.getServiceRecords = function (req, res, next) {
    var type = req.query.type;
    var guid = req.query.guid;
    var pageamount = req.query.pageamount;
    var page = req.query.page;
    var isdelete = req.query.delete;
    var ip = req.query.ip;

    request.get({ url: 'http://' + ip + '/common/records', qs: { type: type, 'guid': guid, 'pageamount': pageamount, 'page': page, 'delete':isdelete } }, function (error, response, body) {
        if (error) {
            console.log('get record info error: ' + error);
            return;
        }
        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 向门户注册
exports.register2portal = function (req, res, next) {
    // type:'datamap', uid: data[i].uid, sname: data[i].name, action: '-1',  sid: data[i]._id,ip:ip 
    var type = req.query.type; //服务类型
    var sid = req.query.sid; // 服务id
    var uid = req.query.uid; // 服务uid
    var sname = req.query.sname; // 服务的名字。用于在门户显示对应计算节点
    var action = req.query.action;//1  注册   -1 取消注册
    var portal_type = '';

    var ip = req.query.ip;
    var host = ip.split(':')[0];
    var port = ip.split(':')[1];

    if (type === 'datamap') {
        portal_type = 'dataMapping';
    } else if (type === 'refactor') {
        portal_type = 'dataRefactor';
    }

    // 发送远程服务
    var url = 'http://223.2.34.42:8080/GeoModeling/registerDataServlet';

    request.get({ url: url, qs: { gid: uid, sname: encodeURIComponent(sname), action: action, collName: portal_type, sid: sid, host: host, port: port } }, function (error, response, body) {
        if (error) {
            console.log('rmt register error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            // res.send(body);
            var associate = '-1';
            if (body === '0') {//已经注册过了
                associate = '1';
            }else if(body === '2'){// 取消成功
                associate = '-1';
            }else if(body === '1'){ // 注册成功
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

// 切换服务状态
exports.switchServiceStatus = function (req, res, next) {

    var type = req.query.type;//哪个服务：data / datamap / refactor
    var sid = req.query.id; // 服务id
    var status = req.query.status;//哪个状态
    var tostatus = req.query.tostatus;//要切换成的状态
    var ip = req.query.ip;

    request.get({ url: 'http://' + ip + '/common/switch', qs: { type: type, id: sid, status: status, tostatus: tostatus } }, function (error, response, body) {
        if (error) {
            console.log('rmt switch service status error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        } else {
            res.send('-1');
        }
    });
}

// 切换记录状态
exports.switchRecordsStatus = function (req, res, next) {

    var type = req.query.type;//哪个服务：data / datamap / refactor
    var guid = req.query.guid; // 那个服务记录：guid标识
    var status = req.query.status;//哪个状态
    var tostatus = req.query.tostatus;//要切换成的状态
    var ip = req.query.ip;

    request.get({ url: 'http://' + ip + '/common/records/switch', qs: { type: type, guid: guid, status: status, tostatus: tostatus } }, function (error, response, body) {
        if (error) {
            console.log('rmt switch records status error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        } else {
            res.send('-1');
        }
    });
}

// 删除服务运行记录
exports.deleteServiceRecords = function (req, res, next) {
    var guid = req.query.guid;
    var type = req.query.type;  // 服务类型： data、datamap、refactor
    var ip = req.query.ip;

    request.get({ url: 'http://' + ip + '/common/records/delete', qs: { type: type, guid: guid } }, function (error, response, body) {
        if (error) {
            console.log('rmt delete records error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        } else {
            res.send('-1');
        }
    });
}

// 删除服务
exports.deleteService = function (req, res, next) {
    var sid = req.query.id;
    var type = req.query.type;  // 服务类型： data、datamap、refactor
    var ip = req.query.ip;

    request.get({ url: 'http://' + ip + '/common/delete', qs: { type: type, id: sid } }, function (error, response, body) {
        if (error) {
            console.log('rmt delete service error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        } else {
            res.send('-1');
        }
    });
}

// 获取服务运行实例
exports.getInstances = function (req, res, next) {
    var guid = req.query.guid;
    var type = req.query.type;//服务类型
    var ip = req.query.ip;

    var username = req.session.username;

    request.get({ url: 'http://' + ip + '/common/instances', qs: { type: type, guid: guid, username: username } }, function (error, response, body) {
        if (error) {
            console.log('get rmt instances error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}