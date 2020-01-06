var rmt_datamap = require('./rmt_datamap.js');
var rmt_user = require('./rmt_user.js');
var rmt_common = require('./rmt_common.js');
var rmt_refactor = require('./rmt_refactor.js');
var rmt_data = require('./rmt_data.js');
var db = require("../../models/db.js");
var rmt_recycle = require('./rmt_recycle.js');

// rmt_datamap
exports.showRmtPage = rmt_datamap.showRmtPage;//显示远程映射服务页面
// exports.getSmtServices = rmt_datamap.getSmtServices;//获取远程服务
// exports.getSnapshot = rmt_datamap.getSnapshot;
exports.showUsePage = rmt_datamap.showUsePage;
exports.getUdxSchema = rmt_datamap.getUdxSchema;
exports.getNode = rmt_datamap.getNode;
exports.callMappingService = rmt_datamap.callMappingService;//调用映射服务
// exports.getInstanceInfo = rmt_datamap.getInstanceInfo;
exports.showMappingResPage = rmt_datamap.showMappingResPage;
// exports.getRecordInfo = rmt_datamap.getRecordInfo;
exports.showRecordPage = rmt_datamap.showRecordPage;
exports.showInstancePage = rmt_datamap.showInstancePage;//显示运行实例页面
// exports.switchDatamap = rmt_datamap.switchDatamap;

// 详情
exports.showDetails = rmt_common.showDetails;//显示详情页面
exports.getDetailContent = rmt_common.getDetailContent;// 获取db中的详情数据
exports.showDetailEdit = rmt_common.showDetailEdit;// 详情编辑页面
exports.uploadDetailImage = rmt_common.uploadDetailImage;//上传详情图片
// exports.getDetalImgs = rmt_common.getDetalImgs;//获取图片详情
exports.saveDetail = rmt_common.saveDetail;
exports.getServices = rmt_common.getServices;
exports.getServiceRecords = rmt_common.getServiceRecords;
exports.register2portal = rmt_common.register2portal;
exports.switchServiceStatus = rmt_common.switchServiceStatus;
exports.switchRecordsStatus = rmt_common.switchRecordsStatus;
exports.deleteServiceRecords = rmt_common.deleteServiceRecords;//删除服务运行记录
exports.deleteService = rmt_common.deleteService;
exports.getInstances  = rmt_common.getInstances;

// 数据
exports.showDataPage = rmt_data.showDataPage;
// exports.getData = rmt_data.getData;
// exports.getDataSnapshot = rmt_data.getDataSnapshot;
exports.dataDownload = rmt_data.dataDownload;


//用户数据
exports.getFileManager = rmt_user.getFileManager;//获取文件管理器
exports.uploadfile = rmt_user.uploadfile;//上传数据
exports.getFiles = rmt_user.getFiles;
exports.checkRepeate = rmt_user.checkRepeate;
exports.deleteUserData = rmt_user.deleteUserData;
exports.updatename = rmt_user.updatename;
exports.addFolder = rmt_user.addFolder;
exports.download = rmt_user.download;
exports.getFileCount = rmt_user.getFileCount;


// 重构
exports.showRefactorPage = rmt_refactor.showRefactorPage;
// exports.getRefactorServices = rmt_refactor.getRefactorServices;
exports.showRefactorDetailPage = rmt_refactor.showRefactorDetailPage;//获取重构服务的详细页面，打开重构服务库中的重构方法
exports.getMethods = rmt_refactor.getMethods;
exports.showRefactorUsePage = rmt_refactor.showRefactorUsePage;
exports.callSingleRefactor = rmt_refactor.callSingleRefactor;//调用
// exports.getSingleRefactorInsInfo = rmt_refactor.getSingleRefactorInsInfo;//获取单个refactor服务运行的实例信息
exports.showRefactorResPage = rmt_refactor.showRefactorResPage;
// exports.getRefactorRecordInfo = rmt_refactor.getRefactorRecordInfo;
exports.getParamSchema = rmt_refactor.getParamSchema;
exports.showRefactorRecordPage = rmt_refactor.showRefactorRecordPage;//显示记录页面
// exports.getRefactorAdvanceRecordInfo = rmt_refactor.getRefactorAdvanceRecordInfo;
exports.showAdvanceResPage = rmt_refactor.showAdvanceResPage;//显示高级操作结果页面
exports.showAdvancePage = rmt_refactor.showAdvancePage;
exports.advanceRun = rmt_refactor.advanceRun;//串联运行
// exports.getAdvanceInsInfo = rmt_refactor.getAdvanceInsInfo;
exports.showRefactorInstancePage = rmt_refactor.showRefactorInstancePage;

// 回收站
exports.showRecyclePage = rmt_recycle.showRecyclePage;



// 获取局域网内所有主机的ip地址。
exports.getIps = function (req, res, next) {

    var pageamount = parseInt(req.query.pageamount);
    var page = parseInt(req.query.page);

    // 查找所有的ip 
    db.find('host', {}, { pageamount: pageamount, page: page, 'sort': { "host": -1 } }, function (err, result) {
        if (err) {
            console.log('can not read the ips from db: ' + result);
            res.send('-1');
            return;
        }

        res.send(result);
    });
}