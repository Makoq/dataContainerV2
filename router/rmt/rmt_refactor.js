// 对http请求的封装模块
var request = require('request');

// 显示重构方法列表页面
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

    res.render('rmt/refactor/rmtrefactorpage', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_0'
    });
}


// 重构服务详细页面：查看重构服务中的方法
exports.showRefactorDetailPage = function (req, res, next) {
    // req.session.currentRouter = "/refactor/detail";
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

    res.render('rmt/refactor/rmtdetailpage', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_0'
    });
}

// 获取重构方法库中的重构方法列表
exports.getMethods = function (req, res, next) {
    var ip = req.query.ip;
    var id = req.query.id;

    request.get({ url: 'http://' + ip + '/refactor/methods', qs: { id: id } }, function (error, response, body) {
        if (error) {
            console.log('get rmt refactor methods error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 使用界面
exports.showRefactorUsePage = function (req, res, next) {
    // req.session.currentRouter = "/refactor/use";
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

    res.render('rmt/refactor/rmtusepage', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_0'
    });
}


// 调用单个refactor服务
exports.callSingleRefactor = function (req, res, next) {

    var ip = req.query.ip;
    var id = req.query.id;
    var method = req.query.method;
    var params = req.query.params;

    var username = req.session.username;

    request.get({ url: 'http://' + ip + '/refactor/call', qs: { id: id, method: method, params: params, username: username } }, function (error, response, body) {

        if (error) {
            console.log('call rmt refactor service error: ' + error);
            return;
        }
        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}


// 获取单个refactor服务运行的实例信息
// exports.getSingleRefactorInsInfo = function (req, res, next) {

//     var guid = req.query.guid;
//     var ip = req.query.ip;

//     request.get({ url: 'http://' + ip + '/refactor/instanceInfo', qs: { guid: guid } }, function (error, response, body) {
//         if (error) {
//             console.log('get rmt single refactor service run infor error: ' + error);
//             return;
//         }

//         if (response.statusCode === 200) {
//             res.send(body);
//         }
//     });
// }

// 显示单个重构服务运行结果页面   
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

    res.render('rmt/refactor/rmtrunres', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_2'
    });
}


// 获取重构服务的schema
exports.getParamSchema = function (req, res, next) {
    var id = req.query.id;
    var schema = req.query.schema;
    var iotype = req.query.iotype;
    var ip = req.query.ip;

    request.get({ url: 'http://' + ip + '/refactor/paramSchema', qs: { id: id, schema: schema, iotype: iotype } }, function (error, response, body) {
        if (error) {
            console.log('get rmt refactor service schema error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        }
    });
}

// 显示记录页面
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

    res.render('rmt/refactor/rmtrecordpage', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_2'
    });
}



// 显示高级操作结果页面
exports.showAdvanceResPage = function (req, res, next) {
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

    res.render('rmt/refactor/rmtadvanceres', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_2'
    });
}

// 显示高级操作页面
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

    res.render('rmt/refactor/rmtadvance', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_4'
    });
}

// 串联运行
exports.advanceRun = function (req, res, next) {

    var ip = req.query.ip;

    // 将ajax请求直接转发给远程服务器
    req.pipe(request.post('http://' + ip + '/refactor/run', function (error, response, body) {
        if (error) {
            console.log('run rmt advance refactor error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.send(body);
        }
    }));

}

// 获取串联服务运行的实例信息
// exports.getAdvanceInsInfo = function (req, res, next) {
//     var guid = req.query.guid;
//     var ip = req.query.ip;

//     request.get({ url: 'http://' + ip + '/refactor/advanceInstanceInfo', qs: { guid: guid } }, function (error, response, body) {
//         if (error) {
//             console.log('get rmt advance refactor instance error: ' + error);
//             return;
//         }

//         if (response.statusCode === 200) {
//             res.send(body);
//         }
//     });
// }

// 显示串联实例页面
exports.showRefactorInstancePage = function(req,res,next){
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

    res.render('rmt/refactor/rmtinstance', {
        "login": login,
        "username": username,
        "active": "refactor",
        "subactive": "refactor_1",
        'th_active': 'refactor_1_1'
    });
}