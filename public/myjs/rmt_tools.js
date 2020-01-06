var firstPageFlag = true;
var rmt_ip = '';
var s_type = '';
// 页码点击事件
function changePage(page) {
    if (firstPageFlag) {
        firstPageFlag = false;
    } else {
        $.ajax({
            url: '/rmt/common/services',
            type: "get",
            async: 'false',
            data: { type:s_type,"pageamount": 10, "page": page - 1, "ids": "all", ip: rmt_ip },
            success: function (data) {
                if (data === '-1') {
                    return;
                }
                rmt_loadServices(data,rmt_ip);
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
function rmt_initPaginator(service_type, pageamount, ip) {
    rmt_ip = ip;
    s_type = service_type;
    $.ajax({
        url: '/rmt/common/services',
        type: "get",
        async: 'false',
        data: { type:s_type,"pageamount": pageamount, "page": 0, "ids": "all", ip: rmt_ip },
        success: function (data) {
            if (data === '-1') {
                return;
            }
            $.get('/common/serviceCount', { stype: s_type, ip: rmt_ip }, function (totalCount) {
                if (totalCount === 0) {
                    $('#paginator').empty();
                } else {
                    // 初始化页码
                    $('#paginator').initPage(totalCount, 1, changePage);
                    // 加载table数据
                    rmt_loadServices(data,rmt_ip);
                }
            });
        }
    });
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


// 删除表格中的项
function deleteService(id, type,ip) {
    if (confirm("Are you sure to delete current item? If you delete it, you also can find it in the recycle bin.")) {
        $.get('/rmt/common/delete', { id: id, type: type ,ip:ip}, function (data) {
            if (data === '-1') {
                toastr.error('failed to delete.', 'Error', { timeOut: 5000 });
                return;
            }
            window.location.reload();
        });
    }
}


// 删除运行记录
function deleteRecord(guid, type,ip) {
    if (confirm("Are you sure to delete current item? If you delete it, you also can find it in the recycle bin.")) {
        $.get('/rmt/common/records/delete', { guid: guid, type: type, ip:ip}, function (data) {
            if (data === '-1') {
                toastr.error('failed to delete.', 'Error', { timeOut: 5000 });
                return;
            }
            window.location.reload();
        });
    }
}