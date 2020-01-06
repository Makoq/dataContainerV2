Blockly.Blocks['block_get_node_by_name'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("get_node_by_name");
        this.appendValueInput("i_node")
            .setCheck("udx_node")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("node");
        this.appendValueInput("i_node_name")
            .setCheck("String")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("node_name");
        this.appendValueInput("i_parent_name")
            .setCheck("String")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("parent_name");
        this.setOutput(true, "udx_node");
        this.setColour(230);
        this.setTooltip("http://geomodeling.njnu.edu.cn/");
        this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
    }
};

Blockly.JavaScript['block_get_node_by_name'] = function (block) {
    var value_i_node = Blockly.JavaScript.valueToCode(block, 'i_node', Blockly.JavaScript.ORDER_ATOMIC);
    var value_i_node_name = Blockly.JavaScript.valueToCode(block, 'i_node_name', Blockly.JavaScript.ORDER_ATOMIC);
    var value_i_parent_name = Blockly.JavaScript.valueToCode(block, 'i_parent_name', Blockly.JavaScript.ORDER_ATOMIC);

    // 调用UDX的函数
    var code = 'get_node_by_name(' + value_i_node + ', ' + value_i_node_name + ', ' + value_i_parent_name + ')';

    return [code, Blockly.JavaScript.ORDER_NONE];
};