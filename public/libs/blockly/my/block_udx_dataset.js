Blockly.Blocks['block_udx_dataset'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("udx_dataset");
    this.appendValueInput("i_source")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("source");
    this.appendValueInput("i_schema")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("schema");
    this.setOutput(true, "udx_node");
    this.setColour(230);
    this.setTooltip("http://geomodeling.njnu.edu.cn/");
    this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
  }
};


Blockly.JavaScript['block_udx_dataset'] = function (block) {
  var value_i_source = Blockly.JavaScript.valueToCode(block, 'i_source', Blockly.JavaScript.ORDER_ATOMIC);
  var value_i_schema = Blockly.JavaScript.valueToCode(block, 'i_schema', Blockly.JavaScript.ORDER_ATOMIC);

  var code = 'get_udx_dataset( ' + value_i_source + ', ' + value_i_schema + ' )';

  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};