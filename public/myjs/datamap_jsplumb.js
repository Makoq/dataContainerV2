
/**
 * jsplumb操作
 * author：kingw
 * time：2017年4月25日10:44:11
 */
//jquery插件，监听div的resize事件。
(function ($, h, c) { var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow"; e[b] = 250; e[f] = true; $.event.special[j] = { setup: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.add(l); $.data(this, d, { w: l.width(), h: l.height() }); if (a.length === 1) { g() } }, teardown: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.not(l); l.removeData(d); if (!a.length) { clearTimeout(i) } }, add: function (l) { if (!e[f] && this[k]) { return false } var n; function m(s, o, p) { var q = $(this), r = $.data(this, d); r.w = o !== c ? o : q.width(); r.h = p !== c ? p : q.height(); n.apply(this, arguments) } if ($.isFunction(l)) { n = l; return m } else { n = l.handler; l.handler = m } } }; function g() { i = h[k](function () { a.each(function () { var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d); if (m !== o.w || l !== o.h) { n.trigger(j, [o.w = m, o.h = l]) } }); g() }, e[b]) } })(jQuery, this);



// var ref = $('#jstree').jstree(true);//获得整个树
// sel = ref.get_selected(); //获得所有选中节点，返回值为数组
// 或者
// sel = ref.get_top_selected(); //获得所有选中的顶层节点，返回值为数组



/**
 * 动态创建Schema tree
 */
// function createTree(serviceid) {



// }


/**模型计数器*/
var modelCounter = 0;
/**
 * 初始化一个jsPlumb实例
 */
var instance = jsPlumb.getInstance({
    DragOptions: { cursor: "pointer", zIndex: 2000 },
    HoverPaintStyle: { strokeStyle: "#2C2C2C" },
    // PaintStyle: { strokeStyle: '#E8C870', lineWidth: 2 },//连线样式
    // EndpointStyle: { radius: 5, fillStyle: '#E8C870' },
    // EndpointHoverStyle: { fillStyle: "#7073EB" },
    ConnectionOverlays: [
        ["Arrow", {
            location: 1,
            visible: true,
            width: 11,
            length: 11,
            direction: 1,
            id: "arrow_forwards"
        }],
        // [ "Arrow", {
        //     location: 0,
        //     visible:true,
        //     width:11,
        //     length:11,
        //     direction:-1,
        //     id:"arrow_backwards"
        // } ],
        // [ "Label", {
        //     location: 0.5,
        //     id: "label",
        //     cssClass: "aLabel"
        // }]
    ],
    Container: "container"
});
instance.importDefaults({
    ConnectionsDetachable: true,
    ReattachConnections: true
});
/**
 * 设置左边菜单
 * @param Data
 */
// function setLeftMenu() {

    // $("#leftMenu").append('<li id="ascii_grid_1" model_type="">Ascii Grid1</li>');
    // $("#leftMenu").append('<li id="ascii_grid_2" model_type="">Ascii Grid2</li>');
    // $("#leftMenu").append('<li id="ascii_grid_3" model_type="">Ascii Grid3</li>');

    //拖拽设置
    // $("#leftMenu li").draggable({
    //     helper: "clone",
    //     scope: "plant"
    // });
    // $("#container").droppable({
    //     scope: "plant",
    //     drop: function (event, ui) {
    //         //console.log(ui);  拖拽的ui
    //         //console.log($(this)); 放置拖拽目标的ui，即容器。
    //         CreateModel(ui, $(this));
    //     }
    // });
// }

/**
 * 添加模型
 * @param ui
 * @param selector
 */
function CreateModel(ui, selector) {
    var modelId = $(ui.draggable).attr("id");
    //console.log($(ui.draggable));//这里就是被拖动的左侧菜单栏的li标签
    var id = modelId + "_model_" + modelCounter++;//model 的 id
    var title = $(ui.draggable).attr("title");

    //请求udx schema
    $.get('/datamap/use/udxSchema', { "id": modelId }, function (data) {
        if (data == -1) {
            alert("服务器忙，请稍后再试！");
            return;
        } else if (data == -2) {
            alert('id参数无效！');
            return;
        }
        var nodes = new UdxNode();
        icon = "offline";
        index = 1;//调用trans方法之前，要设置index=1，以让udx schema 的节点从1开始编号。
        trans(data, nodes);


        var div = $('<div id="'+modelId+'"></div>');

        var tree = div.jstree({
            'core': {
                "multiple": true,//允许多选
                'data': nodes.children,
                'dblclick_toggle': false          //禁用tree的双击展开  
            },
            "plugins": ["search"]
        });

        var parentdiv = $('<div class="model"><h4><span>' + title + '</span><a href="javascript:void(0)" class="pull-right" onclick="removeElement(this);">X</a></h4></div>');  //创建一个父div
        parentdiv.attr('id', id);
        //parentdiv.append(createTree(modelId));//动态创建tree
        parentdiv.append(tree);
        $(selector).append(parentdiv);

        // 监听div大小的变化
        $('#' + id).resize(function () {
            instance.repaintEverything();
        });

        var left = parseInt(ui.offset.left - $(selector).offset().left);
        var top = parseInt(ui.offset.top - $(selector).offset().top);
        $("#" + id).css("position", "absolute").css("left", left).css("top", top);
        // $("#treeview1").css("position","absolute").css("left",left).css("top",top);

        //添加连接点
        addPorts(instance, $("#" + id), ['out'], 'output', id);
        addPorts(instance, $("#" + id), ['in'], 'input', id);

        //注册实体可draggable
        $("#" + id).draggable({
            containment: "parent",
            drag: function (event, ui) {
                instance.repaintEverything();
            },
            stop: function () {
                instance.repaintEverything();
            }
        });


        div.on("changed.jstree", function (e, data) {

            // console.log("The selected nodes are:");
            // console.log(data.node.id);               //选择的node id  
            // console.log(data.node.text);            //选择的node text  
            // alert(data.node.text);
            //console.log(data.selected[0].text);
        });

        //鼠标滑动事件，当移到tree node上时触发
        div.on("hover_node.jstree", function (e, data) {

            // console.log("The selected nodes are:");
            // console.log(data.node.id);               //选择的node id  
            // console.log(data.node.text);            //选择的node text  
            //   console.log(data);

        });

    });

}


//添加端点
function addPorts(instance, node, ports, type, id) {
    //Assume horizental layout
    var number_of_ports = ports.length;
    var i = 0;
    var height = $(node).height();  //Note, jquery does not include border for height
    var y_offset = 1 / (number_of_ports + 1);
    var y = 0;

    for (; i < number_of_ports; i++) {
        var anchor = [0, 0, 0, 0];
        var paintStyle = { radius: 5, fill: '#FF8891' };//连接点的样式
        var isSource = false, isTarget = false;
        if (type === 'output') {
            anchor[0] = 1;
            paintStyle.fill = '#68DF4A';
            isSource = true;
        } else {
            isTarget = true;
        }

        anchor[1] = y + y_offset;
        y = anchor[1];

        instance.addEndpoint(id, { anchors: anchor }, {//端点样式设置
            endpoint: ["Dot", { cssClass: "endpointcssClass" }], //端点形状
            connectorStyle: { stroke: "#62A8D1", strokeWidth: 2 },//基本连接线样式
            paintStyle: paintStyle,	//端点的颜色样式
            isSource: isSource, //是否可拖动（作为连接线起点）
            //connector: ["Flowchart", { stub: 30, gap: 0, coenerRadius: 0, alwaysRespectStubs: true, midpoint: 0.5 }],
            Connector: ["Bezier", { curviness: 50 }],
            isTarget: isTarget, //是否可以放置（连接终点）
            maxConnections: -1
        });
    }
}

//设置连接Label的label
function init(conn) {
    // var label_text;
    // $("#select_sourceList").empty();
    // $("#select_targetList").empty();
    // var sourceName = $("#" + conn.sourceId).attr("modelType");
    // var targetName = $("#" + conn.targetId).attr("modelType");
    // for (var i = 0; i < metadata.length; i++) {
    //     for (var obj in metadata[i]) {
    //         if (obj == sourceName) {
    //             var optionStr = getOptions(metadata[i][obj].properties, metadata[i][obj].name);
    //             $("#select_sourceList").append(optionStr);
    //         } else if (obj == targetName) {
    //             var optionStr = getOptions(metadata[i][obj].properties, metadata[i][obj].name);
    //             $("#select_targetList").append(optionStr);
    //         }
    //     }
    // }
    // $("#submit_label").unbind("click");
    // $("#submit_label").on("click", function () {
    //     setlabel(conn);
    // });
    // $("#myModal").modal();

    var sourceid = conn.sourceId;//.split('_')[0];//58fea88bfd8accde857115dc_model_0
    var targetid = conn.targetId;//.split('_')[0];//58fea88bfd8accde857115dd_model_1

// var ref = $('#jstree').jstree(true);//获得整个树
// sel = ref.get_selected(); //获得所有选中节点，返回值为数组
// 或者
// sel = ref.get_top_selected(); //获得所有选中的顶层节点，返回值为数组

    //  var ref_source = $('#'+sourceid).jstree();//获得整个树
    //  var src_selected = ref_source.get_selected();
    // var ref_target = $('#'+targetid).jstree(true);//获得整个树
    // var taget_selected = ref_target.get_selected();
    console.log($('#'+sourceid).jstree(true).get_selected());
}


//setlabel
function setlabel(conn) {
    conn.getOverlay("label").setLabel($("#select_sourceList").val()
        + ' '
        + $("#select_comparison").val()
        + ' '
        + $("#select_targetList").val());
    if ($("#twoWay").val() == "true") {
        conn.setParameter("twoWay", true);
    } else {
        conn.setParameter("twoWay", false);
        conn.hideOverlay("arrow_backwards");
    }
}
//删除节点
function removeElement(obj) {
    var element = $(obj).parents(".model");
    if (confirm("确定删除该模型？"))
        instance.remove(element);
}



