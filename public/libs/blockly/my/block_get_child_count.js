Blockly.Blocks['block_get_child_count'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("get_child_count");
      this.appendValueInput("i_node")
          .setCheck("udx_node")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("node");
      this.appendValueInput("i_node_name")
          .setCheck("String")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("node_name");
      this.setOutput(true, "Number");
      this.setColour(230);
   this.setTooltip("http://geomodeling.njnu.edu.cn/");
   this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
    }
  };

  Blockly.JavaScript['block_get_child_count'] = function(block) {
    var value_i_node = Blockly.JavaScript.valueToCode(block, 'i_node', Blockly.JavaScript.ORDER_ATOMIC);
    var value_i_node_name = Blockly.JavaScript.valueToCode(block, 'i_node_name', Blockly.JavaScript.ORDER_ATOMIC);
   
    var code = 'get_child_count('+value_i_node+', '+value_i_node_name+')'

    return [code, Blockly.JavaScript.ORDER_NONE];
  };