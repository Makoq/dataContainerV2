var express = require("express");//内部引用了ejs
var router  = require("./router/router.js");
var session = require('express-session');
var rmt_router = require('./router/rmt/rmt_router');
 

// 
var instanceCollection  = require('./models/instanceCollections.js');

// instanceRouter
var routers = require('./router/index.js');

var app =  express();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:1708");
    // res.header("Access-Control-Allow-Origin", "http://localhost:8888");
    // res.header('Access-Control-Allow-Origin', '*') // 使用session时不能使用*，只能对具体的ip开放。
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// 映射服务实例集合
// app.mappingInsCol = new instanceCollection();
// 重构服务实例集合
app.dpInstanceCol = new instanceCollection();
// 串联重构服务实例集合
app.refacorAdvanceCol = new instanceCollection();

//设置模板引擎
app.set("view engine","ejs");

//静态化
app.use(express.static("./public"));
app.use('/visualization',express.static("./upload/visualization"));

// 对于直接请求响应的业务逻辑，上面这种请求-响应的方法是适用的。
// 现在为了把代码分离，而且共享到全局变量，采用下面的 奇技淫巧：其实和上面的手法差不多。
routers(app);


app.get("/",router.showIndex); // 显示首页

app.get("/accounts/login",router.showLogin); // 显示登录页面
app.post("/accounts/doLogin",router.doLogin); // 执行登录
// app.get("/accounts/register",router.showRegister) ;//注册用户
app.post("/accounts/doRegister",router.doRegister) ;//执行注册
app.post("/accounts/checkUser",router.checkUser);
app.get("/accounts/logout",router.doLoginout);


// ************************************************************
// 详情
app.get("/common/detail",router.showDetails);
app.get("/common/detail/eidt",router.showDetailEdit); //显示数据映射服务详细内容编辑页面
app.post('/common/detail/images',router.uploadDetailImage); //图片上传测试
app.get('/common/detail/img',router.getDetalImgs);
app.post('/common/detail/save',router.saveDetail); // 保存datamap详情到数据库
app.get('/common/detailcontent',router.getDetailContent); //获取datamap详情
// 上传
app.get('/common/uploadservice',router.showUploadServicePage); 
app.post('/common/upload',router.uploadService);
// 删除服务
app.get('/common/delete',router.deleteService);
app.get('/rmt/common/delete',rmt_router.deleteService);
// 删除服务运行记录
app.get('/common/records/delete',router.deleteServiceRecords);
app.get('/rmt/common/records/delete',rmt_router.deleteServiceRecords);
// 服务状态切换
app.get('/common/switch',router.switchServiceStatus);
app.get('/rmt/common/switch',rmt_router.switchServiceStatus);
// 记录状态切换
app.get('/common/records/switch',router.switchRecordsStatus);
app.get('/rmt/common/records/switch',rmt_router.switchRecordsStatus);
// 获取服务
app.get('/common/services',router.getServices);
app.get('/rmt/common/services',rmt_router.getServices);
// 获取服务运行记录
app.get('/common/records',router.getServiceRecords);
app.get('/rmt/common/records',rmt_router.getServiceRecords);
// 向门户注册
app.get('/common/register',router.register2portal);
app.get('/rmt/common/register',rmt_router.register2portal);
// 请求运行实例信息
app.get('/rmt/common/instances',rmt_router.getInstances);


// ************************************************************

// 获取服务总数
app.get('/common/serviceCount',router.getServiceCount);  //stype:   data /  datamap  / refactor

// 数据映射
app.get("/dp/mapping",router.showMapPage);
app.get("/dp/mapping/use",router.showUsePage);
app.get("/datamap/use/udxSchema",router.getUdxSchema);
app.get("/datamap/use/getNode",router.getNode);
app.get('/datamap/instance',router.showInstancePage);//显示运行实例界面
app.get('/datamap/record',router.showRecordPage);
app.get('/datamap/result',router.showResPage);// 显示映射运行结果页面
app.get('/datamap/transfer',router.showDatamapTransPage);//显示映射服务迁移页面

// 数据处理
app.get('/dp',router.showRefactorPage);
app.get("/dp/methods",router.getMethods);
app.get("/dp/paramSchema",router.getParamSchema);
app.get('/dp/instance',router.showRefactorInstancePage);
app.get('/dp/record',router.showRefactorRecordPage);
app.get('/dp/result',router.showRefactorResPage);//显示重构运行结果页面
app.get('/dp/new/blockly',router.showBlockly);
app.get("/dp/:id",router.showRefactorDetailPage);
app.get("/dp/:id/:method",router.showRefactorUsePage);

// 数据处理方案
app.get('/dps',router.showDPSPage);
app.get('/dps/new',router.newDPSPage);
// app.get('/dps/result',router.showAdvanceResPage);//显示高级操作结果页面
app.get('/dps/download',router.downloadAdvanceRes);
app.get('/dps/instances',router.showDPSInstances);
app.get('/dps/records',router.showDPSRecords);
app.get('/dps/result',router.showDPSResult);//显示重构运行结果页面
app.post('/dps/save', router.saveStub);
app.get('/dps/stubs',router.getDPSStubs);
app.get('/dps/new/:id', router.newDPSPage);

app.get('/newid',router.getNewId);


//用户数据
app.post('/user/uploadfile',router.uploadfile);
app.get("/user/detail",router.showUserDetail);
app.get('/user/filemanager',router.getFileManager);
app.get('/data/serviceselection',router.selectService);
// app.get("/user/getUserData",router.getUserData);
app.get('/user/deleteUserData',router.deleteUserData);
app.get('/user/tags',router.getUserTags);//获取当前用户datamap的tags
app.get('/user/files',router.getFiles);//获取指定文件夹中的数据
app.get('/user/addFolder',router.addFolder);
app.get('/user/updatename',router.updatename);//更新名字
app.get('/user/checkRepeate',router.checkRepeate);//检查同级目录下文件名是否名称重复
app.get('/user/download',router.download);//下载userdata
// 为门户提供。门户只获取数据。提供给模型容器，模型容器来请求。
app.get('/user/onlyfiles',router.getOnlyFiles);
app.get('/user/filecount',router.getFileCount);
app.get('/rmt/user/filecount',rmt_router.getFileCount);

// 集成,主动获取远程数据服务容器中的数据
app.get('/user/remoteUserData',router.getRemoteUserData);


//可视化
app.get('/visualization',router.showVisualPage);
// 获取Visualization的Schema
app.get('/visualization/use',router.showVisualizationUsePage);
app.get('/visualization/schemas',router.getVisualizationSchemas);
// 获取可视化包中的schema
app.get('/visualization/schema',router.getSchema);


// 数据
app.get('/data',router.showDataPage);
app.get('/data/uploadpage',router.showUploadDataPage);//显示数据上传界面
app.post('/data/upload',router.uploadData);//上传数据,必须是表单提交，get提交是不可以的。
app.post('/data/saveDataInfo',router.saveDataInfo);
// app.get('/data/services',router.getData);
// app.get('/data/snapshot',router.getDataSnapshot);
// app.get('/data/getDataCount',router.getDataCount);
app.get('/data/download',router.dataDownload);
// app.get('/data/switch',router.switchDataServiceStatus);// 切换数据服务状态
// app.get('/data/delete',router.deleteDataService);

// 获取系统信息
app.get('/sys/info',router.getSysStatus);

// 回收站
app.get('/recycle',router.showRecyclePage);
app.get('/rmt/recycle',rmt_router.showRecyclePage);


///////////////////////////////////////////////////////////////////////////////


//!!!!!!!!!!!!!!!!!!! 远程服务!!!!!!!!!!!!!!!!!!!!!!!!!!
/////////////////////////////////////////////////////////////////////////////////
// 考虑到ajax不能够跨域访问，所以，需要在nodejs服务器端做一个转发，在前端将远程服务器的ip传递到后端进行转发。
// 所以，对于本地的请求几乎都要写一个对应的转发请求。

//远程映射
app.get('/rmt/ips',rmt_router.getIps);
app.get('/rmt/datamap',rmt_router.showRmtPage);// 显示远程datamap
// app.get('/rmt/datamap/mapServices',rmt_router.getSmtServices);
app.get('/rmt/datamap/use/udxSchema',rmt_router.getUdxSchema);//datamap使用界面，获取服务的schema。
// app.get('/rmt/datamap/snapshot',rmt_router.getSnapshot);
app.get('/rmt/datamap/use',rmt_router.showUsePage);
app.get('/rmt/datamap/use/getNode',rmt_router.getNode);
app.get('/rmt/datamap/use/call',rmt_router.callMappingService);
// app.get('/rmt/datamap/instanceInfo',rmt_router.getInstanceInfo);
app.get('/rmt/datamap/result',rmt_router.showMappingResPage);
// app.get('/rmt/datamap/recordInfo',rmt_router.getRecordInfo);//获取运行记录信息
app.get('/rmt/datamap/record',rmt_router.showRecordPage);
app.get('/rmt/datamap/instance',rmt_router.showInstancePage);//显示运行实例界面
// app.get('/rmt/datamap/switch',rmt_router.switchDatamap);

// 详情
app.get('/rmt/common/detail',rmt_router.showDetails);
app.get("/rmt/common/detail/eidt",rmt_router.showDetailEdit); //显示数据映射服务详细内容编辑页面
app.post('/rmt/common/detail/images',rmt_router.uploadDetailImage); //图片上传测试
// app.get('/rmt/common/detail/img',rmt_router.getDetalImgs);//获取详情图片。   这个比较特殊，可以直接在后端跳转，所以，就不需要前端路由了。
app.post('/rmt/common/detail/save',rmt_router.saveDetail); // 保存datamap详情到数据库
app.get('/rmt/common/detailcontent',rmt_router.getDetailContent); //获取datamap详情


 





//远程用户数据
app.get('/rmt/user/filemanager',rmt_router.getFileManager);
app.post('/rmt/user/uploadfile',rmt_router.uploadfile);//上传数据
app.get('/rmt/user/files',rmt_router.getFiles);//获取指定文件夹中的数据
app.get('/rmt/user/checkRepeate',rmt_router.checkRepeate);//检查同级目录下文件名是否名称重复
app.get('/rmt/user/deleteUserData',rmt_router.deleteUserData);// 删除用户数据
app.get('/rmt/user/updatename',rmt_router.updatename);//更新名字
app.get('/rmt/user/addFolder',rmt_router.addFolder);
// app.get('/user/tags',router.getUserTags);//获取当前用户datamap的tags
// app.get("/user/detail",router.showUserDetail);
app.get('/rmt/user/download',rmt_router.download);//下载userdata


//远程数据
app.get('/rmt/data',rmt_router.showDataPage);
// app.get('/rmt/data/getData',rmt_router.getData),
// app.get('/rmt/data/snapshot',rmt_router.getDataSnapshot);
app.get('/rmt/data/download',rmt_router.dataDownload);


//远程重构
app.get('/rmt/refactor',rmt_router.showRefactorPage);
// app.get('/rmt/refactor/services',rmt_router.getRefactorServices);
app.get("/rmt/refactor/detail",rmt_router.showRefactorDetailPage);
app.get("/rmt/refactor/methods",rmt_router.getMethods);
app.get("/rmt/refactor/use",rmt_router.showRefactorUsePage);//使用界面
// 本地服务在instanceRouter中实现
app.get('/rmt/refactor/call',rmt_router.callSingleRefactor);
// 本地服务实例信息在instanceRouter中实现
// app.get('/rmt/refactor/instanceInfo',rmt_router.getSingleRefactorInsInfo);
app.get('/rmt/refactor/result',rmt_router.showRefactorResPage);//显示重构运行结果页面
// app.get('/rmt/refactor/recordInfo',rmt_router.getRefactorRecordInfo);//获取重构服务的运行记录信息
app.get("/rmt/refactor/paramSchema",rmt_router.getParamSchema);
app.get('/rmt/refactor/record',rmt_router.showRefactorRecordPage);//显示记录页面
// app.get('/rmt/refactor/advanceRecordInfo',rmt_router.getRefactorAdvanceRecordInfo);
app.get('/rmt/refactor/advanceresult',rmt_router.showAdvanceResPage);//显示高级操作结果页面
app.get('/rmt/refactor/advance',rmt_router.showAdvancePage);//显示高级操作页面
app.post('/rmt/refactor/run',rmt_router.advanceRun);
// app.get('/rmt/refactor/advanceInstanceInfo',rmt_router.getAdvanceInsInfo);
app.get('/rmt/refactor/instance',rmt_router.showRefactorInstancePage);//显示实例页面

// app.get('/refactor/services/count',router.getRefactorServicesCount);// 获取重构服务的个数
// app.get('/refactor/switch',router.switch);// 切换 开始/通知服务 (远程服务不支持删除)
// app.get('/refactor/downloadAdvanceRes',router.downloadAdvanceRes);

//远程可视化

// ********************************************对接接口*******************************************
app.get('/accesscode',router.getAccessCode); // 获取访问码

//404
app.use(function (req, res) {
    res.render("404");
});

app.listen(8898);


console.log("服务器启动成功.");