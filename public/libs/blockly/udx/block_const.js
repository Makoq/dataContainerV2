Blockly.Blocks['block_const'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("alert result value");
      this.appendValueInput("node_value")
          .setCheck("node_value")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("node_value");
      this.setOutput(true, "node_value");
      this.setColour(230);
      this.setTooltip("http://geomodeling.njnu.edu.cn/");
      this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
    }
  };
  
  
  Blockly.JavaScript['block_const'] = function (block) {
    var value_i_value = Blockly.JavaScript.valueToCode(block, 'node_value', Blockly.JavaScript.ORDER_ATOMIC);
  
    // var code = 'get_udx_dataset( ' + value_i_source + ', ' + value_i_schema + ' )';
   
    // value_i_value=value_i_value.substring(1,value_i_value.length-1);

    // console.log()

    // var code = value_i_value.replace('//re', ';alert(app_node)//fuc');  

     
    
    

    // if(code[0]==='('){
    //     let tp=0
    //     console.log("brfore",code)
    //     for(let i=0;i<code.length;i++){
    //         if(code[i]==='(') tp++;

    //         else break
    //     }

    //     code=code.slice(tp,-tp)
    //     console.log("after",code)
    // }
    console.log("chenck check",value_i_value)
    let v=String(value_i_value)
    // code="window.alert("+value_i_value.substring(1,value_i_value.length-1)+")"
    code="window.alert("+v+")"
     
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };