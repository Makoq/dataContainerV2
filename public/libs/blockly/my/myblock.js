Blockly.Blocks['lightswitch'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Turn")
            .appendField(new Blockly.FieldDropdown([["red", "red"], ["yellow", "yellow"], ["green", "green"]]), "lightColor")
            .appendField(new Blockly.FieldDropdown([["on", "on"], ["off", "off"]]), "switch");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.JavaScript['lightswitch'] = function (block) {
    var dropdown_lightcolor = block.getFieldValue('lightColor');
    var dropdown_switch = block.getFieldValue('switch');
    var code = '';

    if (dropdown_switch == 'on') {
        code = "document.getElementById('switch').style.backgroundColor='" + dropdown_lightcolor + "'";
    }
    if (dropdown_switch == 'off') {
        code = "document.getElementById('switch').style.backgroundColor='white'";
    }

    return code;
};