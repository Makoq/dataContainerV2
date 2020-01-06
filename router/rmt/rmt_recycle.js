


// 显示回收站页面
exports.showRecyclePage = function(req,res,next){
    if (req.session.login != "1") {//未登录
        //重定向
        res.redirect('/accounts/login');
        return;
    }

    // req.session.currentRouter = "/datamap";
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }

    res.render("rmt/recycle/rmtrecyclepage", {
        "login": login,
        "username": username,
        "active": "recycle",
        "subactive": "recycle_1",
        "th_active": "recycle_0_0"
    });
}