Blockly.Blocks['block_udx_kernel_type'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("udx_kernel_type")
        .appendField(new Blockly.FieldDropdown([["any","any"], ["list","list"], ["int","int"], ["real","real"], ["string","string"], ["vector2d","vector2d"], ["vector3d","vector3d"], ["vector4d","vector4d"], ["int_array","int_array"], ["real_array","real_array"], ["string_array","string_array"], ["vector2d_array","vector2d_array"], ["vector3d_array","vector3d_array"], ["vector4d_array","vector4d_array"]]), "dd_udx_kernel_type");
    this.setOutput(true, "udx_kernel_type");
    this.setColour(230);
 this.setTooltip("http://geomodeling.njnu.edu.cn/");
 this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
  }
};

Blockly.JavaScript['block_udx_kernel_type'] = function(block) {
  var dropdown_dd_udx_kernel_type = block.getFieldValue('dd_udx_kernel_type');
  var code = '...';

  return [code, Blockly.JavaScript.ORDER_NONE];
};