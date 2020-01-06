var os = require('os');

// 获取系统状态信息
exports.getSysStatus = function (req, res, next) {
    var sysinfo =
        {
            'hostname': os.hostname(),
            'systemtype': os.type(),
            'platform': os.platform(),
            'release': os.release(),
            'uptime': os.uptime(),
            'loadavg': os.loadavg(),
            'totalmem': os.totalmem(),
            'freemem': os.freemem(),
            'cpus': os.cpus(),
            'disk': ''
        };
    var exec = require('child_process').exec;
    //windows disk
    // if(setting.platform == 1)
    // {
    exec('wmic logicaldisk get caption,size,freespace', function (err, stdout, stderr) {
        if (err) {
            console.log(err);
            // return callback(err);
            return;
        }
        var array = stdout.split("\r\r\n");
        array.pop();
        array.pop();
        array.shift();
        var i, j;
        for (i = 0; i < array.length; i++) {
            if (__dirname[0].toLocaleLowerCase() == array[i][0].toLocaleLowerCase()) {
                var space = array[i].split(" ");
                var ele = [];
                for (j = 0; j < space.length; j++) {
                    if (+space[j]) {
                        ele.push(+space[j]);
                    }
                }
                sysinfo.disk = [Math.round((+ele[1] - ele[0]) / (+ele[1]) * 100), __dirname[0].toLocaleUpperCase()];
                // console.log(ele);
                break;
            }
        }
        // sysinfo.disk = array;
        // return callback(null, sysinfo);
        res.send(sysinfo);
    });
    // }
    // else if(setting.platform == 2) // Linux
    // {
    //     var spawn = require('child_process').spawn,
    //         free  = spawn('df');

    //     // 捕获标准输出并将其打印到控制台
    //     free.stdout.on('data', function (data) {
    //         // console.log('标准输出：\n' + data);
    //         // console.log(data.toString());
    //         var diskInfo = data.toString().split('\n');
    //         var i;
    //         for (i=0;i<diskInfo.length;i++){
    //             if(diskInfo[i][diskInfo[i].length-1] == '/'){
    //                 var percent = diskInfo[i].split(/\s+/);
    //                 percent = percent[percent.length-2];
    //                 percent = percent.split('%')[0];
    //                 sysinfo.disk = [+percent,'磁'];
    //                 // console.log(sysinfo.disk);
    //                 break;
    //             }
    //         }
    //         return callback(null, sysinfo);
    //     });
    // }
}