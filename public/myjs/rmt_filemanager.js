
var firstPageFlag = true;
var pid = '';
var ip = GetQueryString('ip');
// 页码点击事件
function changePage(page) {
    if (firstPageFlag) {
        firstPageFlag = false;
    } else {
        $.ajax({
            url: '/rmt/user/files',
            type: "get",
            async: 'false',
            data: { "pageamount": 15, "page": page - 1, "parentid": pid, ip: ip },
            success: function (data) {
                if (data === '-1') {
                    return;
                }
                loadUserData(undefined, pid, data);
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
// 初始化文件管理器的分页控件
function initFilemanagerPaginator(ele, parentid) {
    firstPageFlag = true;
    pid = parentid;
    $.ajax({
        url: '/rmt/user/files',
        type: "get",
        async: 'false',
        data: { "pageamount": 15, "page": 0, "parentid": parentid, ip: ip },
        success: function (data) {
            if (data === '-1') {
                return;
            }
            $.get('/rmt/user/filecount', { parentid: parentid, ip: ip }, function (totalCount) {
                if (totalCount === 0) {
                    $('#paginator').empty();
                } else {
                    // 初始化页码
                    $('#paginator').initPage(totalCount, 1, changePage);
                    // 加载table数据,每个服务页面都有自己的加载方式，所以，这个函数的具体实现分布在每个服务展示页面中。
                    loadUserData(ele, parentid, data);
                }
            });
        }
    });
}