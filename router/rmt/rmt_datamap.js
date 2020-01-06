// 用于远程请求
var http = require('http');
var fs = require('fs');
// 对http请求的封装模块
var request = require('request');

// 显示远程映射服务页面
exports.showRmtPage = function (req, res, next) {
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

    res.render('rmt/datamap/rmtpage', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_1",
        'th_active': 'mapping_1_0'
    });
}


// 获取数据服务的快照
// exports.getSnapshot = function (req, res, next) {

//     var ip = req.query.ip;
//     var sid = req.query.sid;
//     var pic = req.query.pic;

//     //get 请求外网  
//     // http.get('http://' + ip + '/datamap/snapshot?sid=' + sid + '&pic=' + pic, function (req, res1) {
//     //     var json = '';
//     //     req.on('data', function (data) {
//     //         json += data;
//     //     });
//     //     req.on('end', function () {
//     //         res.send(json);
//     //         //console.log(json);
//     //     });
//     // });

//     request.get({ url: 'http://' + ip + '/datamap/snapshot', qs: { 'sid': sid, 'pic': pic } }, function (error, response, body) {
//         if (error) {
//             console.log('load rmt mapping snapshot error: ' + error);
//             return;
//         }

//         if (response.statusCode === 200) {
//             res.send(body);
//         } else {
//             console.log('status code: ' + statusCode);
//             return;
//         }
//     });
// }



// 显示使用界面
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

    res.render('rmt/datamap/rmtusepae', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_1",
        'th_active': 'mapping_1_0'
    });
}

// 获取数据的udx schema
exports.getUdxSchema = function (req, res, next) {
    var ip = req.query.ip;
    var id = req.query.id;
    var type = req.query.type;//json  xml

    //get 请求外网  
    // http.get('http://' + ip + '/datamap/use/udxSchema?id=' + id, function (req, res1) {
    //     var json = '';
    //     req.on('data', function (data) {
    //         json += data;
    //     });
    //     req.on('end', function () {
    //         res.send(json);
    //         //console.log(json);
    //     });
    // });

    request.get({ url: 'http://' + ip + '/datamap/use/udxSchema', qs: { 'id': id , type: type } }, function (error, response, body) {
        if (error) {
            console.log('load mapping udx schema error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        } else {
            console.log('status code: ' + response.statusCode);
            return;
        }
    });
}


// 获取udxSchema节点数据
exports.getNode = function (req, res, next) {
    var id = req.query.id;//服务id
    var nodename = req.query.nodename;
    var oid = req.query.oid;//输入数据
    var ip = req.query.ip;

    var username = req.session.username;

    request.get({ url: 'http://' + ip + '/datamap/use/getNode', qs: { 'id': id, 'nodename': nodename, 'oid': oid, 'username': username } }, function (error, response, body) {
        if (error) {
            console.log('getNode error: ' + error);
            return;
        }
        if (response.statusCode === 200) {
            res.send(body);
        }
    });



    // var username = req.session.username;
    // //选择的文件路径
    // var path = __dirname + '/../../upload/userdata/' + username + '/' + oid;

    // //1. 上传数据到远程服务器
    // var formData = {
    //     // Pass a simple key-value pair
    //     username: 'rmt_' + req.session.username, // 用户标识远程访问的用户，必须添加
    //     sid: id,
    //     parentid: '-1', // 文件上传到远程服务器的目录，默认-1，表示根目录
    //     // Pass data via Buffers
    //     //my_buffer: new Buffer([1, 2, 3]),
    //     // Pass data via Streams
    //     file: fs.createReadStream(path)
    //     // Pass multiple values /w an Array
    //     // attachments: [
    //     //     fs.createReadStream(__dirname + '/attachment1.jpg'),
    //     //     fs.createReadStream(__dirname + '/attachment2.jpg')
    //     // ],
    //     // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
    //     // Use case: for some types of streams, you'll need to provide "file"-related information manually.
    //     // See the `form-data` README for more information about options: https://github.com/form-data/form-data
    //     // custom_file: {
    //     //     value: fs.createReadStream('/dev/urandom'),
    //     //     options: {
    //     //         filename: 'topsecret.jpg',
    //     //         contentType: 'image/jpeg'
    //     //     }
    //     // }
    // };
    // request.post({ url: 'http://' + ip + '/rmt/user/uploadfile', formData: formData }, function optionalCallback(err, httpResponse, body) {
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

// 调用映射服务
exports.callMappingService = function (req, res, next) {
    var ip = req.query.ip;
    var id = req.query.id;
    var in_oid = req.query.in_oid;
    var in_filename = req.query.in_filename;
    var out_dir = req.query.out_dir;
    var out_filename = req.query.out_filename;

    var callType = req.query.callType;

    // 运行服务的时候需要添加用户信息，这样才知道是谁跑了服务。
    var username = req.session.username;

    request.get({ url: 'http://' + ip + '/datamap/use/call', qs: { 'id': id, 'in_oid': in_oid, 'in_filename': in_filename, 'out_dir': out_dir, 'out_filename': out_filename, 'callType': callType, 'username': username } }, function (error, response, body) {
        if (error) {
            console.log('call datamap service error: ' + error);
            return;
        }
        // 返回已开启实例的guid
        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 获取实例信息
// exports.getInstanceInfo = function (req, res, next) {
//     var guid = req.query.guid;
//     var username = req.session.username;
//     var ip = req.query.ip;

//     request.get({ url: 'http://' + ip + '/datamap/instanceInfo', qs: { 'guid': guid,username:username } }, function (error, response, body) {

//         if (error) {
//             console.log('get datamap instance error: ' + error);
//             return;
//         }

//         if (response.statusCode === 200) {
//             res.send(body);
//         }
//     });
// }

// 显示mapping service 运行结果页面
exports.showMappingResPage = function (req, res, next) {
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

    res.render('rmt/datamap/rmtrunres', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_1",
        'th_active': 'mapping_1_0'
    });
}



// 显示远程记录页面
exports.showRecordPage = function (req, res, next) {
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

    res.render('rmt/datamap/rmtrecordpage', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_1",
        'th_active': 'mapping_1_2'
    });
}


// 显示运行实例界面
exports.showInstancePage = function (req, res, next) {
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

    res.render('rmt/datamap/rmtinstancepage', {
        "login": login,
        "username": username,
        "active": "mapping",
        "subactive": "mapping_1",
        'th_active': 'mapping_1_1'
    });

}

// 切换远程映射服务状态
// exports.switchDatamap = function (req, res, next) {
//     var action = req.query.action;
//     var id = req.query.id;
//     var ip = req.query.ip;

//     request.get({ url: 'http://' + ip + '/datamap/switch', qs: { action: action, id: id } }, function (error, response, body) {

//     });
// }