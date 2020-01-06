/**
 * service run instance
 * @param {*} ins instance
 */
function Instance(ins) {

    if (ins === undefined) {
        this.username = '';
        this.guid = '';
        this.sid = '';
        this.starttime = '';
        this.status = '';
        this.sname = '';
    } else {
        this.username = ins.username;
        this.guid = ins.guid;
        this.sid = ins.sid;
        this.starttime = ins.starttime;//开始时间
        this.status = ins.status;//状态：0：结束，1：正在运行
        this.sname = ins.sname;
    }

    return this;
}

module.exports = Instance;
