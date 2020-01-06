

//显示分享页面
exports.showSharingPage = function(req,res,next){
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

   
 res.render('sharing/sharingpage', {
        "login": login,
        "username": username,
        "active": "sharing",
        "subactive":"sharing_0"
    });

}