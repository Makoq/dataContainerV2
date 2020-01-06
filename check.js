//子进程

var exec = require('child_process').exec;

check();

function check(){
	last = exec('netstat -aon|findstr "8899"');
	last.on('exit', function (code) {
		if(code != '0'){
			console.log('主服务已经关闭,正在重启.');
			run();
		}else{
			// 代码是0代表运行正常
			console.log('服务正常运行中');
		}
	});
	setTimeout(check, 5000);
}

function run(){
	last = exec('node app.js');
	last.on("exit", function (code) {
		if(code == '0')
			console.log('服务已重启成功');
		else
			console.log('主服务重启失败');
	});
}