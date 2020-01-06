function udx() {
    this.name = "udx",
        this.say = function (hello) {
            console.log(hello)
        }
}

function get_udx_dataset(source, shcema) {
    var _u = new udx();
    _u.say(_u.name);
    return _u;
}

function get_node_by_name(node, name, parent_node) {
   // var u_d_x = eval(node);
   
   console.log(node  );
}

function get_child_by_index(node, name, index) {

}

function get_item_by_index(node, name, index) {

}

function get_child_count(node,name) {
return 0;
}

function get_node_length(node,name) {

}