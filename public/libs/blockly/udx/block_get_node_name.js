Blockly.Blocks['block_get_node_name'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("get_node_name");
      this.appendValueInput("i_node")
          .setCheck("udx_node")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("node");
      // this.appendValueInput("i_node_name")
      //     .setCheck("String")
      //     .setAlign(Blockly.ALIGN_RIGHT)
      //     .appendField("node_name");
    //   this.appendValueInput("i_inde")
    //       .setCheck("Number")
    //       .setAlign(Blockly.ALIGN_RIGHT)
    //       .appendField("index");
      this.setOutput(true, "udx_node");
      this.setColour(230);
   this.setTooltip("http://geomodeling.njnu.edu.cn/");
   this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
    }
  };
  
  Blockly.JavaScript['block_get_node_name'] = function(block) {
    var value_i_node = Blockly.JavaScript.valueToCode(block, 'i_node', Blockly.JavaScript.ORDER_ATOMIC);
    // var value_i_node_name = Blockly.JavaScript.valueToCode(block, 'i_node_name', Blockly.JavaScript.ORDER_ATOMIC);
    // var value_i_inde = Blockly.JavaScript.valueToCode(block, 'i_inde', Blockly.JavaScript.ORDER_ATOMIC);
  
    // var code = 'get_node_name('+value_i_node+','+value_i_node_name+','+value_i_inde+')'
    // var code = value_i_node+'.getName()'
    // var code = value_i_node.replace('//fuc', '.getName()//fuc');  

    var code =value_i_node +'.getName()';
    if(code.startsWith('(')){
      let tp=0
        //  console.log("brfore",code)    
          for(let i=0;i<code.length;i++){
            if(code[i]==='(') tp++;
    
            else break
          }
    
         
          code=code.substring(tp,value_i_node.length-tp)+'.getName()'
     }
   
   
    return [code, Blockly.JavaScript.ORDER_NONE];
  };