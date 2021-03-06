/**
 * datamap工具类
 * author：kingw
 * time：2017年4月25日13:58:37
 */

function UdxNode() {
    this.children = new Array();
}

// 旧版的schema
var index = 1;
var icon = "online";
function trans(json, nodes) {
    for (var o in json) {
        if (json[o].XDO instanceof Array) {
            // console.log(json[o]['@name']);
            var node = new UdxNode();
            node.id = index++;
            if (typeof (json[o]['@name']) == 'undefined') {
                node.text = 'Dataset';
            } else {
                node.text = json[o]['@name'];
            }
            node.icon = "/plugins/jstree/images/" + icon + ".png";
            node.state = { 'opened': true };
            nodes.children.push(node);
            trans(json[o].XDO, node);
        } else if (json[o].XDO instanceof Object) {
            // console.log(json[o]['@name']);
            // console.log(json[o].XDO['@name']);
            var node = new UdxNode();
            node.id = index++;
            node.text = json[o]['@name'];
            node.state = { 'opened': true };
            node.icon = "/plugins/jstree/images/" + icon + ".png";
            if (json[o].XDO['@name'] != 'undefined') {
                var n = new UdxNode();
                n.id = index++;
                n.text = json[o].XDO['@name'];
                n.icon = "/plugins/jstree/images/" + icon + ".png";
                n.state = { 'opened': true };
                node.children.push(n);

                nodes.children.push(node);
                trans(json[o].XDO.XDO, n);
            } else {
                nodes.children.push(node);
                trans(json[o].XDO.XDO, node);
            }

        } else if (typeof (json[o].XDO) == 'undefined') {
            // console.log(json[o]['@name']);
            var node = new UdxNode();
            node.id = index++;
            node.text = json[o]['@name'];
            node.icon = "/plugins/jstree/images/" + icon + ".png";
            node.state = { 'opened': true };
            nodes.children.push(node);
        }
    }
}

// json遍历原则：for(var o in obj) 如果对象，则o为key；如果为数组，则o为下标

// 标识是否是第一次执行tranverse方法
var isfirst = true;
// var isFirstObj = true;
// 新版的schema
function trans_new(dataset, nodes) {
    // 如果dataset是一个obj的话
    // 一般情况下，udxnode下是一个[]，这个情况是排除不是数组的情况。
    if (dataset instanceof Object && !(dataset instanceof Array) && !isfirst) {
        var node = new UdxNode();
        node.id = index++;
        node.text = dataset['@name'];
        node.icon = "/plugins/jstree/images/" + icon + ".png";
        node.state = { 'opened': true };
        nodes.children.push(node);
        trans_new(dataset.UdxNode, node);
        return;
    }

    for (var o in dataset) {
        if (dataset[o].UdxNode instanceof Array || isfirst) {
            isfirst = false;
            var node = new UdxNode();
            node.id = index++;
            if (typeof (dataset[o]['@name']) == 'undefined') {
                node.text = 'Dataset';
            } else {
                node.text = dataset[o]['@name'];
            }
            node.icon = "/plugins/jstree/images/" + icon + ".png";
            node.state = { 'opened': true };
            nodes.children.push(node);
            trans_new(dataset[o].UdxNode, node);
        } else if (dataset[o].UdxNode instanceof Object) {
            var node = new UdxNode();
            node.id = index++;
            node.text = dataset[o]['@name'];
            node.state = { 'opened': true };
            node.icon = "/plugins/jstree/images/" + icon + ".png";
            if (dataset[o].UdxNode['@name'] != 'undefined') {
                var n = new UdxNode();
                n.id = index++;
                n.text = dataset[o].UdxNode['@name'];
                n.icon = "/plugins/jstree/images/" + icon + ".png";
                n.state = { 'opened': true };
                node.children.push(n);

                nodes.children.push(node);
                trans_new(dataset[o].UdxNode.UdxNode, n);
            } else {
                nodes.children.push(node);
                trans_new(dataset[o].UdxNode.UdxNode, node);
            }

        } else if (typeof (dataset[o].UdxNode) == 'undefined') {
            var node = new UdxNode();
            node.id = index++;
            node.text = dataset[o]['@name'];
            node.icon = "/plugins/jstree/images/" + icon + ".png";
            node.state = { 'opened': true };
            nodes.children.push(node);
        }
    }
}

// 禁用jstree
function disable_jstree() {
    $('#treeview1 li').each(function () {
        $("#treeview1").jstree().disable_node(this.id);
    });
}


// 开启jstree
function enable_jstree() {
    $('#treeview1 li').each(function () {
        $("#treeview1").jstree().enable_node(this.id);
    });
}

// function trans2(json, nodes) {
//     if (json instanceof Object) {
//         //加入子节点
//         console.log(json['@name']);
//         nodes.id = index++;
//         nodes.text = json['@name'];
//         nodes.icon = "/plugins/jstree/images/" + icon + ".png";
//         nodes.state = { 'opened': true };
//         if (json["UdxNode"] !== undefined) {
//             if (json["UdxNode"] instanceof Array) {
//                 for (var o in json["UdxNode"]) {
//                     var child_node = new UdxNode();
//                     nodes.children.push(child_node);
//                     trans2(json["UdxNode"][o], child_node);
//                 }
//             } else if (json["UdxNode"] instanceof Object) {
//                 var child_node = new UdxNode();
//                 nodes.children.push(child_node);
//                 trans2(json["UdxNode"], child_node);
//             }
//         }
//     }
// }

function addChild(json, parent_node, child_node) {
    if (parent_node != undefined) {
        if (json["@name"] !== undefined) {
            child_node.text = json["@name"];

        } else {
            child_node.text = "UdxNode";
        }
        child_node.icon = "/plugins/jstree/images/" + icon + ".png";
        child_node.state = { 'opened': true };
        parent_node.children.push(child_node);
    }
}

/**
 * 从数组中删除指定元素
 * @param {*} arr 原始数组
 * @param {*} val 要移除的元素
 */
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}


//获取地址栏url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
}

// 0 最后一个
// 1 倒数第二个
// ...
function GetParamsString(index){
    var url = window.location.toString().split('/');
    return url[url.length-1-index]
}