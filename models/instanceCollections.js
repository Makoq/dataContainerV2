
var instance = require('./instance.js');

function InstanceCollection() {
    this.instances = [];
}



/**
 * 添加服务实例，返回当前instance在集合中的索引。
 */
InstanceCollection.prototype.addInstance = function (ins) {
    this.instances.push(ins);
    return this.instances.length - 1;
}

/**
 * 根据guid删除服务实例，成功返回1，失败返回-1
 */
InstanceCollection.prototype.removeByGuid = function (guid) {
    for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].guid === guid) {
            this.instances.splice(i, 1);
            return 1;
        }
    }
    return -1;
}

/**
 * 根据guid和username删除服务实例，成功返回1，失败返回-1
 */
InstanceCollection.prototype.removeByGuidAndName = function (guid, username) {
    for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].guid === guid && this.instances[i].username === username) {
            this.instances.splice(i, 1);
            return 1;
        }
    }
    return -1;
}

/**
 * 得到所有的服务实例： 深度拷贝，得到当前实例的完全副本
 */
InstanceCollection.prototype.getAllInstances = function () {
    var arr = new Array();

    for (var i = 0; i < this.instances.length; i++) {
        var ins = {
            guid: this.instances[i].guid,
            sid: this.instances[i].sid,
            starttime: this.instances[i].starttime,
            status: this.instances[i].status,
            username: this.instances[i].username,
            sname:this.instances[i].sname
        };
        arr.push(ins);
    }
    return arr;
}

/**
 * 得到所有的服务实例： 深度拷贝，得到当前实例的完全副本
 */
InstanceCollection.prototype.getAllInstancesByName = function (username) {
    var arr = new Array();

    for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].username === username) {
            var ins = {
                guid: this.instances[i].guid,
                sid: this.instances[i].sid,
                starttime: this.instances[i].starttime,
                status: this.instances[i].status,
                username:this.instances[i].username,
                sname:this.instances[i].sname
            };
            arr.push(ins);
        }
    }
    return arr;
}



/**
 * 根据guid查询实例
 */
InstanceCollection.prototype.getInstanceByGuid = function (guid) {
    for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].guid === guid) {
            return this.instances[i];
        }
    }
    return undefined;
}

/**
 * 根据guid和username查询实例
 */
InstanceCollection.prototype.getInstanceByGuidAndName = function (guid, username) {
    for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].guid === guid && this.instances[i].username === username) {
            return this.instances[i];
        }
    }
    return undefined;
}


/**
 * 根据guid更改实例状态：成功返回 1。 失败返回 -1.
 */
InstanceCollection.prototype.changeStatus = function (guid, status) {
    for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].guid === guid) {
            this.instances[i].status = status;
            return 1;
        }
    }
    return -1;
}

/**
 * 获取实例运行结束后的状态
 */
InstanceCollection.prototype.getStatus = function (guid) {
    for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].guid === guid) {
            return this.instances[i].status;
        }
    }
    return -1;
}

module.exports = InstanceCollection;