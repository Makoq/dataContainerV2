var db = require("./models/db.js");
var ObjectID = require('mongodb').ObjectID;//数据库ObjectId
var formidable = require('formidable');
var fs = require('fs');
var unzip = require("unzip");//解压缩
var xml2js = require('xml2js');
var sd = require('silly-datetime');

// 上传文件夹下所有的压缩包
function uploadAll(dir){
    stats = fs.lstatSync(dir);
}