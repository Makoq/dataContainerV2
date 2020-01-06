// 获取当前时间： yyyy-MM-dd HH:MM:SS

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

// 启用表格搜索
function enable_search(inputid) {
    var to = false;
    $('#' + inputid).keyup(function () {
        if (to) {
            clearTimeout(to);
        }
        to = setTimeout(function () {
            var sstxt = $('#' + inputid).val();
            $("table tbody tr")
                .hide()
                .filter(":contains('" + sstxt + "')")
                .show();
        }, 250);
    });
}

// 页码点击事件
// function changePage(element, service_type, pageamount, page) {
//     // alert(service_type + ','+pageamount + ',' +page);

//     // console.log(element);

//     // console.log($(element).html());



//     var curSelectedText = $(element).html();

//     if (curSelectedText === '&laquo;') {  // <<

//     } else if (curSelectedText === '&raquo;') {// >>

//     }
//     return;

//     loadServices('/' + service_type + '/services', { "pageamount": pageamount, "page": page, "ids": "all" });
// }


var firstPageFlag = true;
var s_type = '';
// 页码点击事件
function changePage(page) {
    if (firstPageFlag) {
        firstPageFlag = false;
    } else {
        $.ajax({
            url: '/common/services',
            type: "get",
            async: 'false',
            data: { type: s_type, "pageamount": 10, "page": page - 1, "ids": "all" },
            success: function (data) {
                if (data === '-1') {
                    return;
                }
                loadServices(data);
                // $.get('/common/serviceCount', {}, function (totalCount) {
                //     if (totalCount === 0) {
                //         $('#paginator').empty();
                //     } else {
                //         // 初始化页码
                //         $('#paginator').initPage(totalCount, 1, changePage);
                //         // 加载table数据
                //         loadServices(data);
                //     }
                // });
            }
        });
    }
}

// 获取服务的个数
// service_type:  data /  datamap  /  refactor  
function initPaginator(service_type, pageamount) {
    s_type = service_type;
    $.ajax({
        url: '/common/services',
        type: "get",
        async: 'false',
        data: { type: s_type, "pageamount": pageamount, "page": 0, "ids": "all" },
        success: function (data) {
            if (data === '-1') {
                return;
            }
            $.get('/common/serviceCount', { stype: s_type }, function (totalCount) {
                if (totalCount === 0) {
                    $('#paginator').empty();
                } else {
                    // 初始化页码
                    $('#paginator').initPage(totalCount, 1, changePage);
                    // 加载table数据,每个服务页面都有自己的加载方式，所以，这个函数的具体实现分布在每个服务展示页面中。
                    loadServices(data);
                }
            });
        }
    });
}


// 往数组中添加数据项，如果存在则忽略
function addItem(arr, item) {
    var isExist = false;
    for (var i = 0; i < arr.length; i++) {
        if (item === arr[i]) {
            isExist = true;
            return;
        }
    }

    // 不存在则添加
    if (!isExist) {
        arr.push(item);
    }
}


// 删除表格中的项
function deleteService(id, type) {
    if (confirm("Are you sure to delete current item? If you delete it, you also can find it in the recycle bin.")) {
        $.get('/common/delete', { id: id, type: type }, function (data) {
            if (data === '-1') {
                toastr.error('failed to delete.', 'Error', { timeOut: 5000 });
                return;
            }
            window.location.reload();
        });
    }
}


// 删除运行记录
function deleteRecord(guid, type) {
    if (confirm("Are you sure to delete current item? If you delete it, you also can find it in the recycle bin.")) {
        $.get('/common/records/delete', { guid: guid, type: type }, function (data) {
            if (data === '-1') {
                toastr.error('failed to delete.', 'Error', { timeOut: 5000 });
                return;
            }
            window.location.reload();
        });
    }
}

// // 8 character ID (base=2)
// uuid(8, 2)  //  "01001010"
// // 8 character ID (base=10)
// uuid(8, 10) // "47473046"
// // 8 character ID (base=16)
// uuid(8, 16) // "098F4D35"
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
}


// 0 最后一个
// 1 倒数第二个
// ...
function GetParamsString(index){
    var url = window.location.toString().split('/');
    return url[url.length-1-index]
}