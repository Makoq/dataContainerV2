var db = require("../models/db.js");
var formidable = require('formidable');
var sd = require('silly-datetime');
var ObjectID = require('mongodb').ObjectID;//数据库ObjectId

exports.showDPSPage = function (req, res, next) {
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

  res.render('dps/dpspage', {
    "login": login,
    "username": username,
    "active": "dps",
    "subactive": "dps_0",
    'th_active': 'dps_0'
  });
}

exports.newDPSPage = function (req, res, next) {
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

  res.render('dps/dps', {
    "login": login,
    "username": username,
    "active": "dps",
    "subactive": "dps_0",
    'th_active': 'dps_0'
  });
}

exports.showDPSInstances = function (req, res, next) {
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

  res.render('dps/instance', {
    "login": login,
    "username": username,
    "active": "dps",
    "subactive": "dps_1",
    'th_active': 'dps_0'
  });
}

exports.showDPSRecords = function (req, res, next) {
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

  res.render('dps/record', {
    "login": login,
    "username": username,
    "active": "dps",
    "subactive": "dps_2",
    'th_active': 'dps_0'
  });
}

exports.showDPSResult = function (req, res, next) {
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

  res.render('dps/result', {
    "login": login,
    "username": username,
    "active": "dps",
    "subactive": "dps_2",
    'th_active': 'dps_0'
  });
}


exports.saveStub = function (req, res, next) {

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    // 当前场景图片
    var json = fields.json;
    var name = fields.name;
    var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');

    var username = req.session.username;//当前用户名
    if (username === undefined) {
      username = req.query.username;
    }

    db.find('dps', { 'name': name }, function (e1, r1) {
      if (e1) {
        console.log(e1);
        res.send('-1');
      }

      // 存在就更新
      if (r1.length != 0) {
        db.updateMany('dps', { 'name': name }, { $set: { 'json': json, 'datetime': time, delete: '-1' } }, function (e2, r2) {
          if (e2) {
            console.log(e2);
            res.send('-1');
            return;
          }
          res.send('1');
        });
      } else {
        //保存信息到数据库。
        db.insertOne('dps', { 'name': name, 'uname': username, 'json': json, 'datetime': time, delete: '-1' }, function (err, result) {
          if (err) {
            console.log('save dps stud error');
            res.send('-1');
          }
          res.send('1');
        });
      }
    })

  });
}


exports.getDPSStubs = function (req, res, next) {
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

  res.render('common/getdpsstub', {
    "login": login,
    "username": username,
    "active": true,
    "subactive": "-1"
    //显示选择按钮，如果直接在detail页面中查看数据的话，是不需要显示选择按钮的。但是我们需要使用数据的时候，就需要显示选择按钮，以确定用户所选择的文件。
  });
}


exports.getNewId = function(req,res,next){
  res.send(new ObjectID())
}