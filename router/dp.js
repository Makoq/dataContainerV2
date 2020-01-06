exports.showBlockly = function (req, res, next) {
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

  res.render('refactor/blockly', {
    "login": login,
    "username": username,
    "active": 'dp',
    "subactive": 'dp_0',
    'th_active': 'dp_0_0'
  });
}