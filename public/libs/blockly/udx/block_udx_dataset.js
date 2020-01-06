Blockly.Blocks['block_udx_dataset'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("udx_dataset_[url]");
    this.appendValueInput("i_id")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("id");
    this.appendValueInput("i_data_name")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("data_name");
    // this.appendValueInput("i_schema")
    //   .setCheck("String")
    //   .setAlign(Blockly.ALIGN_RIGHT)
    //   .appendField("schema");
    this.setOutput(true, "udx_node");
    this.setColour(230);
    this.setTooltip("http://geomodeling.njnu.edu.cn/");
    this.setHelpUrl("http://geomodeling.njnu.edu.cn/");
  }
};


Blockly.JavaScript['block_udx_dataset'] = function (block) {
  var value_i_id = Blockly.JavaScript.valueToCode(block, 'i_id', Blockly.JavaScript.ORDER_ATOMIC);
  var value_i_data_name = Blockly.JavaScript.valueToCode(block, 'i_data_name', Blockly.JavaScript.ORDER_ATOMIC);

  // var value_i_schema = Blockly.JavaScript.valueToCode(block, 'i_schema', Blockly.JavaScript.ORDER_ATOMIC);

  // var code = 'get_udx_dataset( ' + value_i_source + ', ' + value_i_schema + ' )';
  // let name=(value_i_source.split("."))[0]
  // console.log(name.split("'"))
  // name=(name.split("'"))[1]
  // value_i_id=(value_i_id.split("'"))[0] 
  // value_i_data_name=(value_i_data_name.split("'"))[0].trim()
  value_i_data_name = value_i_data_name.slice(1, -1)
  value_i_id = value_i_id.slice(1, -1)

  let v=value_i_id.replace(/(-)/g,'_')

  let name=value_i_data_name.split(".")
  v='ds_name_'+name[0].trim()+'_name_id_'+v.trim() +'_id_ds' ;//数据对应的变量名：data+数据文件名+数据源id
   

  // code+=value_i_id+','
  // code+=')'

  // code+='eval('
  // code+='\"'
  // code+='function f(){'
  // code += 'var '+v+' = new UdxDataset();';
  // code += v+'.createDataset();';
  // code += 'fetch('+ '\'/api/schemadataxml?id='+value_i_id.trim()+'&schemaData='+value_i_data_name.trim() +''+ '\' ' +').then(res => res.json())';
  // code += '.then(re => {';
  // code += v+'.loadFromXmlStream(re.data);';
  // code += 'var node_'+v+' = '+v+'.getSelf();';
  // code+='return node_'+v+''
   
  // code+= "set(node_"+v+"//fuc \n)//re;";
  // code+= "console.log( node_"+v+".getChildNode(1).getChildNodeCount());";
  // code+= "console.log( node_"+v+");";
  // code+= '//node';
  // code+= "console.log( arr)";

  // code += '$node;';
  // code += 'return node_'+v+';';

  // code += '})';
  // code+='};f();'
  // code+='\"'
  // code+=')'

  return [v, Blockly.JavaScript.ORDER_NONE];

    // return [code, Blockly.JavaScript.ORDER_ATOMIC];

 
  // dataset.loadFromXmlStream(this.schemaxml);

  // name=name[1,-1]
  // var code = "var "+name+'=new UdxDataset();'+name+'.createDataset();'+name+'.loadFromXmlStream(that.getUdxDataXml('+name+'.xml));('+name+'.getSelf())';
  //  var code =eval( "return var "+name+'=new UdxDataset();')



};