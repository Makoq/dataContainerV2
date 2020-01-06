
var request = require('request');

// 显示数据列表页面
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

    res.render("rmt/data/rmtdatapage", {
        "login": login,
        "username": username,
        "active": "dataservice",
        "subactive": "dataservice_1",
        'th_active': 'dataservice_1_0'
    });
}

// 获取数据服务
// exports.getData = function (req, res, next) {
//     var ip = req.query.ip;
//     var pageamount = req.query.pageamount;
//     var page = req.query.page;
//     var ids = req.query.ids;

//     request.get({ url: 'http://' + ip + '/data/getData', qs: { pageamount: pageamount, page: page, ids: ids } }, function (error, response, body) {
//         if (error) {
//             console.log('get rmt data services error: ' + error);
//             return;
//         }
//         if (response.statusCode === 200) {
//             res.send(body);
//         }
//     });
// }

// 获取数据服务的快照
// exports.getDataSnapshot = function (req, res, next) {
//     var did = req.query.did;
//     var pic = req.query.pic;
//     var ip = req.query.ip;

//     request.get({ url: 'http://' + ip + '/data/snapshot', qs: { did: did, pic: pic } }, function (error, response, body) {
//         if (error) {
//             console.log('get rmt data service snapshot error:' + error);
//             return;
//         }
//         if (response.statusCode === 200) {
//             res.send(body);
//         }
//     });
// }

// 下载数据服务
exports.dataDownload = function (req, res, next) {

    var ip = req.query.ip;
    var id = req.query.id;

    request.get({ url: 'http://' + ip + '/data/download', qs: { id: id } }, function (error, response, body) {
        if (error) {
            console.log('download data service error: ' + error);
            return;
        }

        if (response.statusCode === 200) {
            res.set({
                'Content-Type': 'file/xml',
                'Content-Length': body.length
            });
            res.setHeader('Content-Disposition', 'attachment; filename=' + id + '.zip');

            res.end(body);
        }
    });
}