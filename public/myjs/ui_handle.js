/**
 * 
 * @param {*} _ul_name 
 * @param {*} _href 
 * @param {*} _type 0:  info ; 1:  success; 2: warning; 3 :danger.
 * @param {*} _content 
 * @param {*} _date  format:yyyy-MM-dd hh:mm:ss
 */
function add_notifications(_ul_name, _href, _type, _content, _date) {
    var notification_index = 0;
    //判断是否有提示信息（判断是否有类）
    var count_node = $("span[name=notifications_count]");

    //修改总数目
    if (count_node !== undefined) {
        if (count_node.hasClass("badge")) {
            notification_index = window.sessionStorage.notifications_count;
        } else {
            count_node.addClass("badge");
            count_node.addClass("badge-default");
        }
    }
    notification_index++;
    count_node.text(notification_index);
    //添加信息
    var time_info = get_date_str(_date);
    var type_o = get_notification_type(_type);
    var html_content = '';

    html_content += '<li><a href="' + _href + '">';
    html_content += '<span class="time">' + time_info + '</span>';
    html_content += '<span class="details">';
    html_content += '<span class="label label-sm label-icon label-' + type_o.note_type + '">';
    html_content += '<i class="fa ' + type_o.icon_type + '"></i>';
    html_content += '</span>' + _content + '</span>';
    html_content += ' </a></li>';
    $("ul[name=" + _ul_name + "]").append(html_content);
    //记录进sessionStorage
    $("span[name=notifications_head]").text(notification_index);
    window.sessionStorage.notifications_count = notification_index;
}


function get_notification_type(_type) {
    var rslt_type = function (_note_type, _icon_type) {
        this.note_type = _note_type;
        this.icon_type = _icon_type;
    }
    switch (_type) {
        case 0:
            return new rslt_type('info', 'fa-bullhorn');
        case 1:
            return new rslt_type('success', 'fa-plus');
        case 2:
            return new rslt_type('warning', 'fa-bell-o');
        case 3:
            return new rslt_type('danger', 'fa-bolt');
        default:
            return new rslt_type('info', 'fa-bullhorn');
    }
}

/**
 * 获取显示的时间间隔字符串
 * @param {*} _date  format:yyyy-MM-dd hh:mm:ss
 */
function get_date_str(_date) {
    var NowDate = new Date().format("yyyy-MM-dd hh:mm:ss");
    var d_length = get_interval_days(_date, NowDate);
    var one_year_ms = 60 * 60 * 24 * 1000 * 365;
    var one_month_ms = 60 * 60 * 24 * 1000 * 30;
    var one_day_ms = 60 * 60 * 24 * 1000;
    var one_hour_ms = 60 * 60 * 1000;
    var one_minute_ms = 60 * 1000;
    var one_second_ms = 1000;
    var _value;
    if (d_length > one_year_ms) {
        _value = parseInt(d_length / one_year_ms);
        if (_value > 10) return new Date(_date).format("yyyy-MM-dd");
        else if (_value > 1) return _value + ' years';
        else return _value + ' year';
    } else if (d_length > one_month_ms) {
        _value = parseInt(d_length / one_month_ms);
        if (_value > 1) return _value + ' months';
        else return _value + ' month';
    } else if (d_length > one_day_ms) {
        _value = parseInt(d_length / one_day_ms);
        if (_value > 1) return _value + ' days';
        else return _value + ' day';
    } else if (d_length > one_hour_ms) {
        _value = parseInt(d_length / one_hour_ms);
        if (_value > 1) return _value + ' hours';
        else return _value + ' hour';
    } else if (d_length > one_minute_ms) {
        _value = parseInt(d_length / one_minute_ms);
        if (_value > 1) return _value + ' minutes';
        else return _value + ' minute ';
    } else if (d_length > one_second_ms) {
        _value = parseInt(d_length / one_second_ms);
        if (_value > 1) return _value + ' seconds';
        else return _value + ' second';
    }else{
        return 'just now';
    }
}
/**
 * 求日期差
 * @param {*} _date1 
 * @param {*} _date2 
 */
function get_interval_days(_date1, _date2) {
    //转回毫秒
    var Ms1 = new Date(_date1).getTime();
    var Ms2 = new Date(_date2).getTime();
    return Ms2-Ms1;
}


Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}        