Blockly.Blocks['block_get_child_by_index'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("get_child_by_index");
    this.appendValueInput("i_node")
      .setCheck("udx_node")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("parent node");
    // this.appendValueInput("i_node_name")
    //     .setCheck("String")
    //     .setAlign(Blockly.ALIGN_RIGHT)
    //     .appendField("node_name");
    this.appendValueInput("i_idx")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("index");
    this.setOutput(true, "udx_node");
    this.setColour(230);
    this.setTooltip("http://geomodeling.njnu.edu.cn/");
    this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
  }
};

Blockly.JavaScript['block_get_child_by_index'] = function (block) {
  var value_i_node = Blockly.JavaScript.valueToCode(block, 'i_node', Blockly.JavaScript.ORDER_ATOMIC);
  // var value_i_node_name = Blockly.JavaScript.valueToCode(block, 'i_node_name', Blockly.JavaScript.ORDER_ATOMIC);
  var value_i_idx = Blockly.JavaScript.valueToCode(block, 'i_idx', Blockly.JavaScript.ORDER_ATOMIC);

  var code = value_i_node + '.getChildNode(' + value_i_idx + ')';
  
  if (code.startsWith('(')) {
    code = code.substring(1,code.length-1);
  }

  return [code, Blockly.JavaScript.ORDER_NONE];
};