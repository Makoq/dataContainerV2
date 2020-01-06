Blockly.Blocks['block_get_child_by_index'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get_child_by_index");
    this.appendValueInput("i_node")
        .setCheck("udx_node")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("node");
    this.appendValueInput("i_node_name")
        .setCheck("String")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("node_name");
    this.appendValueInput("i_inde")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("index");
    this.setOutput(true, "udx_node");
    this.setColour(230);
 this.setTooltip("http://geomodeling.njnu.edu.cn/");
 this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
  }
};

Blockly.JavaScript['block_get_child_by_index'] = function(block) {
  var value_i_node = Blockly.JavaScript.valueToCode(block, 'i_node', Blockly.JavaScript.ORDER_ATOMIC);
  var value_i_node_name = Blockly.JavaScript.valueToCode(block, 'i_node_name', Blockly.JavaScript.ORDER_ATOMIC);
  var value_i_inde = Blockly.JavaScript.valueToCode(block, 'i_inde', Blockly.JavaScript.ORDER_ATOMIC);

  var code = 'get_child_by_index('+value_i_node+','+value_i_node_name+','+value_i_inde+')'
 
  return [code, Blockly.JavaScript.ORDER_NONE];
};