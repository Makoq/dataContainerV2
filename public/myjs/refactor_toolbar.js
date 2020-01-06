// /**
//  * 工具栏操作
//  * author： kingw
//  * time：2017年4月25日10:43:35
//  */
// var serviceids = new Array();
// var services = [];
// var ids = [];

// //! 在模态框显示完毕后触发
// $('#addModal').on('shown.bs.modal', function () {
//     $("#tBody").empty();
//     $('#loading').show();

//     // 请求重构服务
//     $.get('/common/services', { type: 'dp', ids: 'all' }, function (data) {
//         if (data === '-1') {
//             toastr.error('failed to get refactor services.', 'Error', { timeOut: 3000 });
//             return;
//         }
//         var html = '';
//         for (var i = 0; i < data.length; i++) {
//             html += '<tr>' +
//                 '<td>' + i + '</td>' +
//                 '<td>' + data[i].name + '</td>' +
//                 '<td>' + data[i].author + '</td>' +
//                 '<td><input type="checkbox" name="cb" id="' + data[i]._id + '" /><label for="' + data[i]._id + '">choose</label></td>' +
//                 '</tr>';
//         }
//         $('tBody').append($(html));

//         $('#serTable').DataTable();
//         $('#loading').hide();
//     });


//     //请求服务,一定要加上ids属性，如果查询全部，则指定"all"，否则传id数组
//     // $.get('/datamap/getMapServices', { "pageamount": 5, "page": 0, "ids": "all" }, function (data) {
//     //     if (data == -1) {
//     //         alert('查询数据失败.');
//     //         return;
//     //     } else {
//     //         //  console.log(data);
//     //         var compiled = _.template($("#moban").html());

//     //         for (var i = 0; i < data.length; i++) {
//     //             //data[i].
//     //             //数据绑定
//     //             var html = compiled({
//     //                 id: i + 1,
//     //                 name: data[i].name,
//     //                 author: data[i].author,
//     //                 _id: data[i]._id.toString()
//     //             });

//     //             //DOM操作，添加节点
//     //             $("#tBody").append($(html));
//     //         }
//     //     }
//     // });
// });

// //! 添加服务
// $('#btnAdd').click(function () {
//     //获取服务
//     $("#addModal").modal();
// });


// // 模态框ok按钮
// $('#btn_add_ok').click(function () {

//     $('#loading').show();

//     //     return;
//     // 选择的服务ids
//     var sids = new Array();

//     var cbs = $("input[name='cb']:checked");
//     for (var i = 0; i < cbs.length; i++) {
//         // serviceids.push($(cbs[i]).attr('serviceid'));
//         // alert($(cbs[i]).attr('id'));
//         sids.push($(cbs[i]).attr('id'));
//     }

//     if (sids.length == 0) {
//         $('#loading').hide();
//         return;
//     }

//     // 请求服务
//     $.get('/common/services', { type: 'dp', ids: sids }, function (data) {
//         if (data == -1) {
//             toastr.error('failed to get factor services.', 'Error', { timeOut: 5000 });
//             return;
//         }

//         loadRefactorServices(data);
//         $('#loading').hide();
//     });

// });

// // 加载选定的refactor service
// function loadRefactorServices(data) {
//     $('#accordion').html('');

//     var html = '';
//     var panelParent = $('<div class="panel panel-success"></div>');

//     //data是一个数组
//     for (var i = 0; i < data.length; i++) {
//         var serviceId = data[i]._id;//服务id
//         //再次请求 methods
//         (function iterator() {
//             if (i == data.length) {
//                 //添加到对话框中
//                 $('#accordion').append(panelParent);
//                 return;
//             }

//             html = '<div class="panel-heading">'
//                 + '<h4 class="panel-title">'
//                 + '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '">' + data[i].name + '</a>'
//                 + '</h4>'
//                 + '</div>';
//             var panelHeading = $(html);
//             var divCollapse = $('<div id="collapse' + i + '" class="panel-collapse collapse" style="cursor:pointer"></div>');
//             var ul = $('<ul class="list-group"></ul>');

//             // 请求方法名
//             $.get('/dp/methods', { 'id': serviceId }, function (methods) { //methods: methods.json
//                 var methodInfo = JSON.parse(methods).RefactorMethodInfo;
//                 for (var j = 0; j < methodInfo.Method.length; j++) {
//                     var info = methodInfo.Method[j];
//                     var mName = info['@name'];//方法名
//                     var mDescription = info['@description'];// 方法描述

//                     var li = $('<li class="list-group-item">' + mName + '</li>');

//                     //设置拖拽
//                     li.draggable({
//                         helper: "clone",
//                         containment: 'document',
//                         scope: "plant"
//                     });

//                     $("#container").droppable({
//                         scope: "plant",
//                         drop: function (event, ui) {
//                             //console.log(ui); // 拖拽的ui
//                             //console.log($(this)); 放置拖拽目标的ui，即容器。
//                             //CreateModel(ui, $(this));//传递服务_id，用于查找schema
//                             //alert('ok');
//                             //genGraph();
//                             var pos = { left: event.offsetX, top: event.offsetY };
//                             var tmpDesc = '';
//                             // 根据拖拽的方法名，找到其对应的方法描述
//                             for (var k = 0; k < methodInfo.Method.length; k++) {
//                                 if ($(ui.draggable)[0].innerText === methodInfo.Method[k]['@name']) {
//                                     // 找到对应的方法描述
//                                     tmpDesc = methodInfo.Method[k]['@description'];
//                                 }
//                             }
//                             // 拖拽的时候，生成图形
//                             genGraph($(ui.draggable)[0].innerText, tmpDesc, pos);
//                         }
//                     });

//                     // 生成图形：方法-矩形，参数-圆形
//                     function genGraph(methodName, mDes, pos) {
//                         var params = '';
//                         for (var m = 0; m < methodInfo.Method.length; m++) {
//                             if (methodInfo.Method[m]['@name'] === methodName) {
//                                 params = methodInfo.Method[m]['Params'];
//                                 break;
//                             }
//                         }

//                         //参数的定位点
//                         var pInPos = { left: pos.left, top: pos.top };
//                         var POutPos = { left: pos.left + 200, top: pos.top };
//                         var pInNodes = new Array();//输入参数节点数组
//                         var pOutNodes = new Array();//输出参数节点数组
//                         var pVerticalDistance = 70;

//                         for (var p = 0; p < params.length; p++) {
//                             var param = params[p];
//                             var iotype = param['@type'];
//                             var name = param['@name'];
//                             var datatype = param['@datatype']; //== 'System.String' ? "String" : param['@datatype'];
//                             var description = param['@description'];
//                             var schema = param['@schema'];

//                             if (iotype === 'in') {
//                                 var pInNode = new JTopo.CircleNode(name);
//                                 pInNode.uid = uuid(8, 16);
//                                 pInNode.fontColor = "0,0,0";
//                                 pInNode.textPosition = 'Middle_Center';
//                                 pInNode.font = "12px Arial";
//                                 pInNode.setLocation(pInPos.left, pInPos.top);
//                                 pInNode.fillColor = initColor; // 填充颜色
//                                 pInNode.methodName = methodName;//该参数所属于的方法名
//                                 pInNode.serviceId = serviceId;//该参数所属于的服务id
//                                 //参数的各项属性
//                                 pInNode.iotype = iotype;
//                                 pInNode.datatype = datatype;//参数类型：string
//                                 pInNode.description = description;
//                                 pInNode.schema = schema;

//                                 // pInNode.borderWidth = 1; 
//                                 // pInNode.borderColor = '0,0,0'; //边框颜色
//                                 pInNode.radius = 30;
//                                 scene.add(pInNode);

//                                 pInNodes.push(pInNode);
//                                 pInPos.top += pVerticalDistance;

//                                 pInNode.isParam = '0';//默认不是参数

//                                 //设置菜单事件
//                                 // pInNode.mouseup(function (event) {
//                                 //     currentNode = this;
//                                 //     handler(event);
//                                 // });

//                             } else if (iotype === 'out') {

//                                 var pOutNode = new JTopo.CircleNode(name);
//                                 pOutNode.uid = uuid(8, 16);
//                                 pOutNode.textPosition = 'Middle_Center';
//                                 pOutNode.fontColor = "0,0,0";
//                                 pOutNode.font = "12px Arial";
//                                 pOutNode.setLocation(POutPos.left, POutPos.top);
//                                 pOutNode.fillColor = initColor; // 填充颜色
//                                 pOutNode.iotype = 'out';
//                                 pOutNode.methodName = methodName;
//                                 pOutNode.serviceId = serviceId;//所属于服务id
//                                 pOutNode.radius = 30;
//                                 //参数的各项属性
//                                 pOutNode.iotype = iotype;
//                                 pOutNode.datatype = datatype;//参数类型：string
//                                 pOutNode.description = description;
//                                 pOutNode.schema = schema;

//                                 scene.add(pOutNode);
//                                 POutPos.top += pVerticalDistance;
//                                 pOutNodes.push(pOutNode);

//                                 pOutNode.isParam = '0';//参数 //默认不是参数
//                                 // pOutNode.mouseup(function (event) {
//                                 //     currentNode = this;
//                                 //     handler(event);
//                                 // });
//                             } else {
//                                 alert('params error: unknown iotype.');
//                                 return;
//                             }
//                         }

//                         var sum = 0;
//                         for (var kk = 0; kk < pInNodes.length; kk++) {
//                             sum += pInNodes[kk].getBound().top;
//                         }
//                         sum /= pInNodes.length;

//                         //画方法Model
//                         var mNode = new JTopo.Node(methodName);
//                         // nodeTo.textPosition = 'Middle_Center';
//                         mNode.fontColor = "0,0,0";
//                         mNode.uid = uuid(8, 16);
//                         // mNode.geometry = 'cube';
//                         // mNode.serializedProperties.push(mNode);//保存序列化属性
//                         mNode.textPosition = 'Middle_Center';
//                         mNode.setLocation((pInPos.left + POutPos.left) / 2, sum);
//                         mNode.setSize(60, 60);
//                         mNode.fillColor = initColor; // 填充颜色
//                         mNode.serviceId = serviceId;//当方法所属于的服务id
//                         mNode.description = mDes;//方法的描述
//                         //记录输入输出节点(数组)
//                         mNode.inNodes = pInNodes;
//                         mNode.outNodes = pOutNodes;

//                         // mNode.borderWidth = 1; 
//                         // mNode.borderColor = '0,0,0'; //边框颜色
//                         scene.add(mNode);

//                         //添加链接
//                         for (var kk = 0; kk < pInNodes.length; kk++) {
//                             var link = new JTopo.Link(pInNodes[kk], mNode); // 增加连线
//                             link.arrowsRadius = 12; //箭头大小
//                             scene.add(link);
//                         }

//                         for (var kk = 0; kk < pOutNodes.length; kk++) {
//                             var link = new JTopo.Link(mNode, pOutNodes[kk]); // 增加连线
//                             link.arrowsRadius = 12; //箭头大小
//                             scene.add(link);
//                         }
//                     }//end func

//                     ul.append(li);

//                 }
//                 panelParent.append(panelHeading);
//                 divCollapse.append(ul);
//                 panelParent.append(divCollapse);
//                 panelParent.append($('<div style="background:#D3EDF7;height:6px;">&nbsp;</div>'));

//                 iterator(i + 1);
//             });
//         })(i);
//     }

// };

/**
 * 工具栏操作
 * author： kingw
 * time：2017年4月25日10:43:35
 */
var serviceids = new Array();
var services = [];
var ids = [];

//! 在模态框显示后触发
$('#addModal').on('shown.bs.modal', function () {
    $("#tBody").empty();
    $('#loading').show();

    // 请求all重构服务
    $.get('/common/services', { type: 'dp', ids: 'all' }, function (data) {
        if (data === '-1') {
            toastr.error('failed to get refactor services.', 'Error', { timeOut: 3000 });
            return;
        }
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<tr>' +
                '<td>' + i + '</td>' +
                '<td>' + data[i].name + '</td>' +
                '<td>' + data[i].author + '</td>' +
                '<td><input type="checkbox" name="chooseService" id="' + data[i]._id + '" /><label for="' + data[i]._id + '">choose</label></td>' +
                '</tr>';
        }
        $('tBody').append($(html));

        $('#serTable').DataTable();
        $('#loading').hide();
    });

});

//! 添加服务 弹出模态框
$('#btnAdd').click(function () {
    //获取服务
    $("#addModal").modal();
});


// 模态框ok按钮
$('#btn_add_ok').click(function () {

    $('#loading').show();

    // 选择的服务ids
    var sids = new Array();

    var cbs = $("input[name='chooseService']:checked");
    for (var i = 0; i < cbs.length; i++) {
        // serviceids.push($(cbs[i]).attr('serviceid'));
        // alert($(cbs[i]).attr('id'));
        sids.push($(cbs[i]).attr('id'));
    }

    if (sids.length == 0) {
        $('#loading').hide();
        return;
    }

    // 请求服务
    $.get('/common/services', { type: 'dp', ids: sids }, function (data) {
        if (data == -1) {
            toastr.error('failed to get factor services.', 'Error', { timeOut: 5000 });
            return;
        }

        loadRefactorServices(data);
        $('#loading').hide();
    });

});

// 加载选定的refactor service
function loadRefactorServices(data) {
    $('#accordion').html('');

    var html = '';
    var panelParent = $('<div class="panel panel-success"></div>');

    //data是一个数组
    for (var i = 0; i < data.length; i++) {
        var serviceId = data[i]._id;//服务id
        //再次请求 methods
        (function iterator() {
            if (i == data.length) {
                //添加到对话框中
                $('#accordion').append(panelParent);
                return;
            }

            html = '<div class="panel-heading">'
                + '<h4 class="panel-title">'
                + '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '">' + data[i].name + '</a>'
                + '</h4>'
                + '</div>';
            var panelHeading = $(html);
            var divCollapse = $('<div id="collapse' + i + '" class="panel-collapse collapse" style="cursor:pointer"></div>');
            var ul = $('<ul class="list-group"></ul>');

            // 请求方法名
            $.get('/dp/methods', { 'id': serviceId }, function (methods) { //methods: methods.json
                var methodInfo = JSON.parse(methods).RefactorMethodInfo;

                services.push(methodInfo);
                ids.push(serviceId)
               // ids.push(JSON.parse(methods).returnId);

                var tempArray = [];
                if (methodInfo.Method instanceof Array) {
                    tempArray = methodInfo.Method;
                } else {
                    tempArray.push(methodInfo.Method);
                }

                for (var j = 0; j < tempArray.length; j++) {
                    var info = tempArray[j];

                    var mName = info['@name'];//方法名
                    var mDescription = info['@description'];// 方法描述

                    var li = $('<li class="list-group-item">' + mName + '</li>');

                    //设置拖拽
                    li.draggable({
                        helper: "clone",
                        containment: 'document',
                        scope: "plant"
                    });

                    $("#container").droppable({
                        scope: "plant",
                        drop: function (event, ui) {

                            var pos = { left: event.offsetX, top: event.offsetY };
                            var tmpDesc = '';
                            var info;
                            var id;

                            // 根据拖拽的方法名，找到其对应的方法描述
                            for (var j = 0; j < services.length; j++) {
                                if (services[j].Method instanceof Array) {
                                    for (var k = 0; k < services[j].Method.length; k++) {
                                        if ($(ui.draggable)[0].innerText === services[j].Method[k]['@name']) {
                                            // 找到对应的方法描述
                                            tmpDesc = services[j].Method[k]['@description'];
                                            info = services[j].Method[k];
                                            id = ids[j];
                                            break;
                                        }
                                    }

                                } else {

                                    if ($(ui.draggable)[0].innerText === services[j].Method['@name']) {
                                        // 找到对应的方法描述
                                        tmpDesc = services[j].Method['@description'];
                                        info = services[j].Method;
                                        id = ids[j];

                                    }

                                }

                            }
                            // 拖拽的时候，生成图形
                            genGraph($(ui.draggable)[0].innerText, tmpDesc, pos, info, id);
                        }
                    });

                    ul.append(li);

                    //html += '<li class="list-group-item">' + mName + '</li>';
                }
                panelParent.append(panelHeading);
                divCollapse.append(ul);
                panelParent.append(divCollapse);
                panelParent.append($('<div style="background:#D3EDF7;height:6px;">&nbsp;</div>'));

                iterator(i + 1);
            });
        })(i);
    }

};


// 生成图形：方法-矩形，参数-圆形
function genGraph(methodName, mDes, pos, info, serviceId) {
    var params = info.Params;
    //参数的定位点
    var pInPos = { left: pos.left, top: pos.top };
    var POutPos = { left: pos.left + 200, top: pos.top };
    var pInNodes = new Array();//输入参数节点数组
    var pOutNodes = new Array();//输出参数节点数组
    var pVerticalDistance = 70;

    for (var p = 0; p < params.length; p++) {
        var param = params[p];
        var iotype = param['@type'];
        var name = param['@name'];
        var datatype = param['@datatype'];// == 'System.String' ? "String" : param.$.datatype;
        var description = param['@description'];
        var schema = param['@schema'];

        if (iotype === 'in') {
            var pInNode = new JTopo.CircleNode(name);
            pInNode.uid = uuid(8, 16);
            pInNode.fontColor = "0,0,0";
            pInNode.textPosition = 'Middle_Center';
            pInNode.font = "12px Arial";
            pInNode.setLocation(pInPos.left, pInPos.top);
            pInNode.fillColor = initColor; // 填充颜色
            //pInNode.iotype = 'in';
            pInNode.methodName = methodName;//该参数所属于的方法名
            pInNode.serviceId = serviceId;//该参数所属于的服务id
            //参数的各项属性
            pInNode.iotype = iotype;
            pInNode.datatype = datatype;//参数类型：string
            pInNode.description = description;
            pInNode.schema = schema;

            // pInNode.borderWidth = 1; 
            // pInNode.borderColor = '0,0,0'; //边框颜色
            pInNode.radius = 30;
            scene.add(pInNode);

            pInNodes.push(pInNode);
            pInPos.top += pVerticalDistance;

            pInNode.isParam = '0';//默认不是参数

        } else if (iotype === 'out') {

            var pOutNode = new JTopo.CircleNode(name);
            pOutNode.uid = uuid(8, 16);
            pOutNode.textPosition = 'Middle_Center';
            pOutNode.fontColor = "0,0,0";
            pOutNode.font = "12px Arial";
            pOutNode.setLocation(POutPos.left, POutPos.top);
            pOutNode.fillColor = initColor; // 填充颜色
            pOutNode.iotype = 'out';
            pOutNode.methodName = methodName;
            pOutNode.serviceId = serviceId;//所属于服务id
            pOutNode.radius = 30;
            //参数的各项属性
            pOutNode.iotype = iotype;
            pOutNode.datatype = datatype;//参数类型：string
            pOutNode.description = description;
            pOutNode.schema = schema;

            scene.add(pOutNode);
            POutPos.top += pVerticalDistance;
            pOutNodes.push(pOutNode);

            pOutNode.isParam = '0';//参数 //默认不是参数
         
        } else {
            alert('params error: unknown iotype.');
            return;
        }
    }

    var sum = 0;
    for (var kk = 0; kk < pInNodes.length; kk++) {
        sum += pInNodes[kk].getBound().top;
    }
    sum /= pInNodes.length;

    //画方法Model
    var mNode = new JTopo.Node(methodName);
    mNode.uid = uuid(8, 16);
    // nodeTo.textPosition = 'Middle_Center';
    mNode.fontColor = "0,0,0";
    // mNode.geometry = 'cube';
    // mNode.serializedProperties.push(mNode);//保存序列化属性
    mNode.textPosition = 'Middle_Center';
    mNode.setLocation((pInPos.left + POutPos.left) / 2, sum);
    mNode.setSize(60, 60);
    mNode.fillColor = initColor; // 填充颜色
    mNode.serviceId = serviceId;//当方法所属于的服务id
    mNode.description = mDes;//方法的描述
    //记录输入输出节点(数组)
    mNode.inNodes = pInNodes;
    mNode.outNodes = pOutNodes;

    // mNode.borderWidth = 1; 
    // mNode.borderColor = '0,0,0'; //边框颜色
    scene.add(mNode);

    //添加链接
    for (var kk = 0; kk < pInNodes.length; kk++) {
        var link = new JTopo.Link(pInNodes[kk], mNode); // 增加连线
        link.arrowsRadius = 12; //箭头大小
        scene.add(link);
    }

    for (var kk = 0; kk < pOutNodes.length; kk++) {
        var link = new JTopo.Link(mNode, pOutNodes[kk]); // 增加连线
        link.arrowsRadius = 12; //箭头大小
        scene.add(link);
    }
}//end func



// toolbar操作
// 放大
$('#btnZoomIn').click(function () {
    scene.zoomOut();
});

// // 缩小
$('#btnZoomOut').click(function () {
    scene.zoomIn();
});

//选择模式
$('#btnSelect').click(function () {
    scene.mode = 'select';
    isLinkMode = false;
    $('#curMode').text('Selection Mode');
    $('#curMode').removeClass('label-warning').addClass('label-info');
});

// 居中显示
$('#btnCenter').click(function () {
    scene.centerAndZoom(); //缩放并居中显示
});

//保存为图片
$('#btnSavePic').click(function () {
    // TODO：如果自动下载就好了
    stage.saveImageInfo();

    // var img = stage.saveImageInfo();
    // stage.saveAsLocalImage(); // 获取图片的base64格式数据
    // console.log(stage.canvas.toDataURL());
    // console.log(img);

    //stage.saveAsLocalImage();
});

$('#btnSave').click(function () {
    var eles = scene.getDisplayedElements();
    console.log(eles);
    if (eles.length <= 0) {
        alert('these are nothing have to save.');
        return;
    }

    var nodes = [];
    var links = [];
    for (var i = 0; i < eles.length; i++) {
        if (eles[i].elementType == 'node') {
            if (eles[i].iotype == undefined) { // 方法node
                var node = {};
                node.uid = eles[i].uid;
                node.serviceId = eles[i].serviceId;
                node.description = eles[i].description;
                node.fillColor = initColor;//eles[i].fillColor;
                node.text = eles[i].text;
                node.x = eles[i].x;
                node.y = eles[i].y;
                nodes.push(node);
            } else { // 参数node
                var node = {};
                node.uid = eles[i].uid;
                node.text = eles[i].text;
                node.x = eles[i].x;
                node.y = eles[i].y;
                node.fillColor = eles[i].fillColor;
                node.methodName = eles[i].methodName;//该参数所属于的方法名
                node.serviceId = eles[i].serviceId;
                node.iotype = eles[i].iotype;
                node.datatype = eles[i].datatype;//参数类型：string
                node.description = eles[i].description;
                node.schema = eles[i].schema;

                // 是否已经赋值.可能为undefined
                node.datapath = eles[i].datapath;//当前选择的别名
                node.pid = eles[i].pid;// 目录id
                node.realpath = eles[i].realpath;// 存储真实的数据路径。如果是输出数据的话，data.oid表示输出数据的目录
                node.oid = eles[i].oid; // 请求schema时传递，用于标志输出文件

                nodes.push(node);
            }
        } else if (eles[i].elementType == 'link') {
            var link = {};
            link.nodeA = eles[i].nodeA.uid;
            link.nodeZ = eles[i].nodeZ.uid;

            links.push(link);
        }
    }

    var json = { "nodes": nodes, "links": links };

    var name = prompt("Please input a name...");

    if (name != null) {
        // 保存到数据库
        $.post('/dps/save', { json: JSON.stringify(json), name: name }, function (data) {
            if (data != "-1")
                toastr.success('save successful.', 'Success', { timeOut: 1000 });
        });
    }

});

var win = undefined;
$('#btnOpen').click(function () {

    win = window.open('/dps/stubs', 'DPS Stubs', 'height=500,width=900,top=100,left=100');
});

function search_node(nodes, uid) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].uid == uid) {
            return nodes[i];
        }
    }
    return undefined;
}

function find_param_nodes(nodes, mNode, type) {
    var paramNodes = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].iotype == type) { // in or out
            if (nodes[i].methodName == mNode.text) {
                paramNodes.push(nodes[i]);
            }
        }
    }
    return paramNodes;
}

function subSelected(jsonStr) {
    scene.clear();
    jsonStr = jsonStr.replace(/\\/g, '');
    jsonStr = jsonStr.substring(1, jsonStr.length - 1);

    var json = JSON.parse(jsonStr);

    if (json != undefined) {
        var nodes = json.nodes;
        var links = json.links;

        var node_list = [];

        // 先绘制节点
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].iotype == undefined) { // method node
                var mNode = new JTopo.Node(nodes[i].text);
                // nodeTo.textPosition = 'Middle_Center';
                mNode.fontColor = "0,0,0";
                mNode.uid = nodes[i].uid;
                // mNode.serializedProperties.push(mNode);//保存序列化属性
                mNode.textPosition = 'Middle_Center';
                mNode.setLocation(nodes[i].x, nodes[i].y);
                mNode.setSize(60, 60);
                mNode.fillColor = nodes[i].fillColor; // 填充颜色
                mNode.serviceId = nodes[i].serviceId;//当方法所属于的服务id
                mNode.description = nodes[i].description;//方法的描述
                //记录输入输出节点(数组)
                mNode.inNodes = find_param_nodes(node_list, mNode, 'in');
                mNode.outNodes = find_param_nodes(node_list, mNode, 'out');

                scene.add(mNode);
                node_list.push(mNode);

            } else {
                var pNode = new JTopo.CircleNode(nodes[i].text);
                pNode.uid = nodes[i].uid;
                pNode.fontColor = "0,0,0";
                pNode.textPosition = 'Middle_Center';
                pNode.font = "12px Arial";
                pNode.setLocation(nodes[i].x, nodes[i].y);
                pNode.fillColor = nodes[i].fillColor; // 填充颜色
                pNode.methodName = nodes[i].methodName;//该参数所属于的方法名
                pNode.serviceId = nodes[i].serviceId;//该参数所属于的服务id
                //参数的各项属性
                pNode.iotype = nodes[i].iotype;
                pNode.datatype = nodes[i].datatype;//参数类型：string
                pNode.description = nodes[i].description;
                pNode.schema = nodes[i].schema;

                pNode.datapath = nodes[i].datapath;//当前选择的别名
                pNode.pid = nodes[i].pid;// 目录id
                pNode.realpath = nodes[i].realpath;// 存储真实的数据路径。如果是输出数据的话，data.oid表示输出数据的目录
                pNode.oid = nodes[i].oid;

                pNode.radius = 30;
                scene.add(pNode);
                node_list.push(pNode);
            }
        }

        // 绘制链接
        for (var i = 0; i < links.length; i++) {
            var nodeA = search_node(node_list, links[i].nodeA);
            var nodeZ = search_node(node_list, links[i].nodeZ);

            if (nodeA != undefined && nodeZ != undefined) {
                var link = new JTopo.Link(nodeA, nodeZ);
                link.arrowsRadius = 12;
                scene.add(link);
            }
        }

        if (win != undefined)
            win.close();
    }
}



//link mode
$('#btnLink').click(function () {
    isLinkMode = true;
    beginNode = null;
    $('#curMode').text('Linking Mode');
    $('#curMode').removeClass('label-info').addClass('label-warning');
});

//refresh
$('#btnRefresh').click(function () {
    // var jsonStr = stage.toJson();
    // console.log(jsonStr);
    // console.log(scene.selectedElements[0]);
});

// 删除选中节点
$('#btnDelete').click(function () {
    for (var i = 0; i < scene.selectedElements.length; i++) {
        // if(scene.selectedElements[i].elementType==='node'){
        //console.log(scene.selectedElements[i].text);
        scene.remove(scene.selectedElements[i]);
        // }
    }
    //console.log(scene.selectedElements);
});

$("#dialog").dialog({
    autoOpen: false,
    width: 400,
    height: 500,
    // buttons: [
    //     {
    //         text: "Ok",
    //         click: function () {
    //             $(this).dialog("close");
    //         }
    //     },
    //     {
    //         text: "Cancel",
    //         click: function () {
    //             $(this).dialog("close");
    //         }
    //     }
    // ]
});

$('#btnRun').click(function () {
    $("#runModal").modal();
});

// 开始run
$('#btn_run_ok').click(function () {

    if ($('#ins_alias').val().length <= 0) {
        toastr.error('you may input the alias for current instance.', 'Error', { timeOut: 3000 });
        return;
    }

    $('#loading').show();
    //存储所有的方法节点
    var mNodes = new Array();
    var mNodeIds = new Array(); //考虑到有重复的方法名，但是uid不会重复，所以根据uid找对应的方法在数组中的索引。
    //当前场景中设计到几个refactor service
    var refactorServices = new Array();

    for (var i = 0; i < scene.childs.length; i++) {
        if (!(scene.childs[i] instanceof JTopo.CircleNode) && !(scene.childs[i] instanceof JTopo.Link)) {
            // console.log(scene.childs[i].text);
            // var li = $('<li style="background:#1CC8F9;" class="list-group-item">' + scene.childs[i].text + '</li>');
            // ul.append(li);
            //保存方法节点,可能有相同元素（同样的方法使用多次）
            mNodes.push(scene.childs[i]);
            mNodeIds.push(scene.childs[i].uid);

            var serviceid = scene.childs[i].serviceId;
            //先看涉及到几个refactor service
            //先删除，后push，避免重复---奇技淫巧
            removeByValue(refactorServices, serviceid);
            refactorServices.push(serviceid);
        }
    }

    // 方法节点
    var nodeCount = mNodes.length;

    // 获得启动顺序
    var visited = new Array();
    for (var i = 0; i < mNodes.length; i++) {
        visited[i] = 0;
    }

    //保存正确执行顺序的方法数组
    var orderedMethods = new Array();

    var isRoot = false;
    function findNode(mNode, mIndex) {
        var pInNodes = mNode.inNodes; // 当前方法节点的所有输入节点
        for (var i = 0; i < pInNodes.length; i++) {
            var node = pInNodes[i];

            //判断当前输入node是否有上一个节点
            if (node.inLinks.length == 0) {// 输入节点没有依赖节点
                isRoot = true;
            } else if (node.inLinks.length > 1) {
                throw 'error: node.inLinks.length>1';
            } else {//有依赖节点

                isRoot = false;

                var outNode = node.inLinks[0].nodeA;

                if (outNode.inLinks.length > 1) {
                    throw 'error:outNode.inLinks.length>1.';
                }

                //var index = mNodes.indexOf(outNode.inLinks[0].nodeA);
                //避免有重复方法,我们使用id唯一标识一个node
                var index = mNodeIds.indexOf(outNode.inLinks[0].nodeA.uid);
                if (index === -1)//没有找到，说明已被遍历过，被删除了
                    return;

                findNode(outNode.inLinks[0].nodeA, index);
            }
        }

        // 当前输入节点没有是独立的，也就是没有上一个输入节点
        if (isRoot) {
            if (!visited[mIndex]) {
                visited[mIndex] = 1;
                orderedMethods.push(mNode);
            }
        }
    }

    while (orderedMethods.length < nodeCount) {
        //每次循环完毕，找完最外离散的节点
        //删除这些节点，开始第二轮查找
        for (var i = 0; i < orderedMethods.length; i++) {
            var index = mNodes.indexOf(orderedMethods[i]);
            mNodes.splice(index, 1);
            mNodeIds.splice(index, 1);
        }

        for (var i = 0; i < mNodes.length; i++) {
            //判断当前节点的依赖节点
            findNode(mNodes[i], i);//每次只找当前节点最开始依赖的那个节点
        }
    }

    //至此，orderedMethods 数组中的方法有序
    var methodsJson = '';
    var linksJson = '';

    for (var i = 0; i < scene.childs.length; i++) {
        var node = scene.childs[i];
        if (node instanceof JTopo.Node && !(scene.childs[i] instanceof JTopo.CircleNode)) {//方法
            var name = node.text;//方法名
            var paramJson = '';

            // 输入参数节点
            var pInNodes = node.inNodes;
            for (var j = 0; j < pInNodes.length; j++) {
                // value 存储真实的输入数据的路径 
                paramJson += '{"id":"' + pInNodes[j].uid + '","name":"' + pInNodes[j].text + '","value":"' + pInNodes[j].realpath + '","iotype":"in","dir":"' + pInNodes[j].pid + '","filename":"' + pInNodes[j].datapath + '"},';
            }
            // name: 节点的名字
            // filename:节点的输入文件名字 datapath： 数据别名，filename
            // realpath: 真实的数据路径，其实就是oid       
            // dir：所在目录
            //输出参数节点
            var pOutNodes = node.outNodes;
            for (var j = 0; j < pOutNodes.length; j++) {
               // node.oid 是打开对话框请求schema的时候，从服务器端传递过来的。
               // 如果当前节点是输出节点，则这个oid则作为该节点的输出数据id
                paramJson += '{"id":"' + pOutNodes[j].uid + '","name":"' + pOutNodes[j].text + '","value":"' + pOutNodes[j].oid + '","iotype":"out","dir":"' + pOutNodes[j].pid + '","filename":"' + pOutNodes[j].datapath + '"},';
            }
            //去掉最后一个逗号
            paramJson = '{"params":[' + paramJson.substring(0, paramJson.length - 1) + '],"inCount":' + pInNodes.length + ',"name":"' + name + '","serviceId":"' + node.serviceId + '"}';

            methodsJson += paramJson + ',';

        } else if (node instanceof JTopo.Link) {//链接

            var nodeA = node.nodeA.uid;
            var nodeZ = node.nodeZ.uid;

            linksJson += '{"from":"' + nodeA + '","to":"' + nodeZ + '"},'
        }
    }

    methodsJson = '"methods":[' + methodsJson.substring(0, methodsJson.length - 1) + ']';
    linksJson = '"links":[' + linksJson.substring(0, linksJson.length - 1) + ']';

    var json = '{' + methodsJson + ',' + linksJson + ',';

    var orderJson = '';
    for (var i = 0; i < orderedMethods.length; i++) {
        orderJson += '"' + orderedMethods[i].text + '",';
    }
    orderJson = '"orders":[' + orderJson.substring(0, orderJson.length - 1) + ']';

    json += orderJson + '}';

    //发送到后端
    $.post('/dps/run', { 'json': json, imgData: stage.canvas.toDataURL(), ins_alias: $('#ins_alias').val() }, function (guid) {

        //如果当前的页面不关闭，则拿着这个guid去请求 当前实例的状态，如果完成了，则跳转另一个页面
        var clockId = setInterval(function () {
            $.get('/common/instances', { type: 'dps', guid: guid }, function (instance) {
                // console.log('instance: ' + instance);

                // 映射服务运行完毕之后，就删除实例了。所以，在这里就请求不到了。
                // if (instance != undefined) {
                //     // 判断它的status
                //     if (instance.status === '0') {
                //         // 0 ： 正在执行    
                //     } else if (instance.status === '1' || instance.status === '-1') {
                //         // 1 :  已经完成   -1 : 发生异常
                //         // 无论是已完成还是发生异常 ，都执行跳转到另一个结果页面、
                //     }
                // }

                // 说明已经执行完毕了
                if (instance === '') {
                    $('#loading').hide();
                    window.location = '/dps/result?guid=' + guid;
                }
                // clearInterval(clockId);
            });
        }, 1000);

        // if (data === '-1') {
        // alert('执行脚本文件错误，请认真检查您出workflow是否真确.');
        // } else {
        // var arr = data.split(',');
        // for (var i = 0; i < arr.length; i++) {
        //     var filename = arr[i];
        //     window.open('/refactor/downloadAdvanceRes?filename=' + filename);
        // }
        // }
    });
});

//显示工具箱
$('#btnOpen').click(function () {
    $("#files").click();

    // 请求工具箱数据
    //拖拽设置
    // $(".list-group li").draggable({
    //     helper: "clone",
    //     containment: 'window' ,
    //     scope: "plant"
    // });
    // $("#scene").droppable({
    //     scope: "plant",
    //     drop: function (event, ui) {
    //         //console.log(ui); // 拖拽的ui
    //         //console.log($(this)); 放置拖拽目标的ui，即容器。
    //         //CreateModel(ui, $(this));//传递服务_id，用于查找schema
    //         alert('ok');
    //     }
    // });

    /*<div class="panel panel-success">
         <div class="panel-heading">
             <h4 class="panel-title">
                 <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">{{=name}}</a>
             </h4>
         </div>
         <div id="collapseOne" class="panel-collapse collapse" style="cursor:pointer">
                 <ul class="list-group">
                     <li class="list-group-item">免费域名注册</li>
                     <li class="list-group-item">免费 Window 空间托管</li>
                     <li class="list-group-item">图像的数量</li>
                     <li class="list-group-item">24*7 支持</li>
                     <li class="list-group-item">每年更新成本</li>
                 </ul>
         </div>
     </div>*/

    // $('#input-file-btn').on('dblclick',function(){
    //     alert('ok');
    // });


    // $("#dialog").dialog("open");
});


/*<!--<div class="btn-toolbar">
    <div class="btn-group btn-group-sm" style="margin-bottom:5px;">-->
        <!--<input type="file" id="files" style="display:none" onchange="importFile();" />-->
        <button title="choose services" id="btnOpen" type="button" class="btn btn-default"><span class="glyphicon glyphicon-folder-open" style="color:#666"></span></button>
        <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-floppy-save" style="color:#666"></span></button>
        <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-duplicate" style="color:#666"></span></button>
        <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-paste" style="color:#666"></span></button>
        <button id="btnRun" type="button" class="btn btn-default"><span class="glyphicon glyphicon-play" style="color:#666"></span></button>
        <button id="btnTools" type="button" class="btn btn-default"><span class="glyphicon glyphicon-ok" style="color:#666"></span></button>
        <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-refresh" style="color:#666"></span></button>
        <button id='btnClear' type="button" class="btn btn-default"><span class="glyphicon glyphicon-trash" style="color:#666"></span></button>
        <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-print" style="color:#666"></span></button>
    </div>
</div>*/

// 页面工具栏
function showJTopoToobar(stage) {

    var toobarDiv = $('<div style="margin-top:3px;margin-left:2px" class="btn-toolbar">').html(''
        + '<input type="radio" name="modeRadio" value="normal" checked id="r1"/>'
        + '<label for="r1"> 默认</label>'
        + '&nbsp;<input type="radio" name="modeRadio" value="select" id="r2"/><label for="r2"> 框选</label>'
        + '&nbsp;<input type="radio" name="modeRadio" value="edit" id="r4"/><label for="r4"> 加线</label>'
        + '&nbsp;&nbsp;<input type="checkbox" id="zoomCheckbox"/><label for="zoomCheckbox">鼠标缩放</label>'
        //+ '&nbsp;&nbsp;<input type="text" id="findText" style="width: 100px;" value="" onkeydown="enterPressHandler(event)">'
        //+ '<input type="button" id="findButton" value=" 查 询 ">'
        // bootstrap toolbar
        + '<div class="btn-group btn-group-sm" style="margin-bottom:5px;">'
        //+ '<input type="button" id="centerButton" value="居中显示"/>'
        + '<button type="button" title="居中显示" id="centerButton" class="btn btn-default"><span class="glyphicon glyphicon-floppy-save" style="color:#666"></span></button>'
        //+ '<input type="button" id="fullScreenButton" value="全屏显示"/>'
        + '<button type="button" title="全屏显示" id="fullScreenButton" class="btn btn-default"><span class="glyphicon glyphicon-floppy-save" style="color:#666"></span></button>'
        //+ '<input type="button" id="zoomOutButton" value=" 放 大 " />'
        + '<button type="button" title="放大" id="zoomOutButton" class="btn btn-default"><span class="glyphicon glyphicon-floppy-save" style="color:#666"></span></button>'
        //+ '<input type="button" id="zoomInButton" value=" 缩 小 " />'
        + '<button type="button" title="缩小" id="zoomInButton" class="btn btn-default"><span class="glyphicon glyphicon-floppy-save" style="color:#666"></span></button>'
        //+ '&nbsp;&nbsp;<input type="button" id="exportButton" value="导出PNG">'
        + '<button type="button" title="导出PNG" id="exportButton" class="btn btn-default"><span class="glyphicon glyphicon-floppy-save" style="color:#666"></span></button>'
        + '&nbsp;&nbsp;'
        + '</div>');

    // var toobarDiv = $('<div class="jtopo_toolbar">').html(''
    //     + '<input type="radio" name="modeRadio" value="normal" checked id="r1"/>'
    //     + '<label for="r1"> 默认</label>'
    //     + '&nbsp;<input type="radio" name="modeRadio" value="select" id="r2"/><label for="r2"> 框选</label>'
    //     + '&nbsp;<input type="radio" name="modeRadio" value="edit" id="r4"/><label for="r4"> 加线</label>'
    //     + '&nbsp;&nbsp;<input type="button" id="centerButton" value="居中显示"/>'
    //     + '<input type="button" id="fullScreenButton" value="全屏显示"/>'
    //     + '<input type="button" id="zoomOutButton" value=" 放 大 " />'
    //     + '<input type="button" id="zoomInButton" value=" 缩 小 " />'
    //     + '&nbsp;&nbsp;<input type="checkbox" id="zoomCheckbox"/><label for="zoomCheckbox">鼠标缩放</label>'
    //     + '&nbsp;&nbsp;<input type="text" id="findText" style="width: 100px;" value="" onkeydown="enterPressHandler(event)">'
    //     + '<input type="button" id="findButton" value=" 查 询 ">'
    //     + '&nbsp;&nbsp;<input type="button" id="exportButton" value="导出PNG">');

    $('#container').prepend(toobarDiv);

    // 工具栏按钮处理
    $("input[name='modeRadio']").click(function () {
        stage.mode = $("input[name='modeRadio']:checked").val();
    });
    $('#centerButton').click(function () {
        stage.centerAndZoom(); //缩放并居中显示
    });
    $('#zoomOutButton').click(function () {
        stage.zoomOut();
    });
    $('#zoomInButton').click(function () {
        stage.zoomIn();
    });
    // $('#cloneButton').click(function(){
    // 	stage.saveImageInfo();
    // });
    $('#exportButton').click(function () {
        stage.saveImageInfo();
    });
    // $('#printButton').click(function() {
    //     stage.saveImageInfo();
    // });
    $('#zoomCheckbox').click(function () {
        if ($('#zoomCheckbox').is(':checked')) {
            stage.wheelZoom = 1.2; // 设置鼠标缩放比例
        } else {
            stage.wheelZoom = null; // 取消鼠标缩放比例
        }
    });
    $('#fullScreenButton').click(function () {
        runPrefixMethod(stage.canvas, "RequestFullScreen")
    });

    window.enterPressHandler = function (event) {
        if (event.keyCode == 13 || event.which == 13) {
            $('#findButton').click();
        }
    };

    // 查询
    $('#findButton').click(function () {
        var text = $('#findText').val().trim();
        //var nodes = stage.find('node[text="'+text+'"]');
        var scene = stage.childs[0];
        var nodes = scene.childs.filter(function (e) {
            return e instanceof JTopo.Node;
        });
        nodes = nodes.filter(function (e) {
            if (e.text == null) return false;
            return e.text.indexOf(text) != -1;
        });

        if (nodes.length > 0) {
            var node = nodes[0];
            node.selected = true;
            var location = node.getCenterLocation();
            // 查询到的节点居中显示
            stage.setCenter(location.x, location.y);

            function nodeFlash(node, n) {
                if (n == 0) {
                    node.selected = false;
                    return;
                };
                node.selected = !node.selected;
                setTimeout(function () {
                    nodeFlash(node, n - 1);
                }, 300);
            }

            // 闪烁几下
            nodeFlash(node, 6);
        }
    });
}

var runPrefixMethod = function (element, method) {
    var usablePrefixMethod;
    ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
        if (usablePrefixMethod) return;
        if (prefix === "") {
            // 无前缀，方法首字母小写
            method = method.slice(0, 1).toLowerCase() + method.slice(1);
        }
        var typePrefixMethod = typeof element[prefix + method];
        if (typePrefixMethod + "" !== "undefined") {
            if (typePrefixMethod === "function") {
                usablePrefixMethod = element[prefix + method]();
            } else {
                usablePrefixMethod = element[prefix + method];
            }
        }
    }
    );

    return usablePrefixMethod;
};
/*
runPrefixMethod(this, "RequestFullScreen");
if (typeof window.screenX === "number") {
var eleFull = canvas;
eleFull.addEventListener("click", function() {
	if (runPrefixMethod(document, "FullScreen") || runPrefixMethod(document, "IsFullScreen")) {
		runPrefixMethod(document, "CancelFullScreen");
		this.title = this.title.replace("退出", "");
	} else if (runPrefixMethod(this, "RequestFullScreen")) {
		this.title = this.title.replace("点击", "点击退出");
	}
});
} else {
alert("浏览器不支持");
}*/