/**
 * Created by kingw on 2017/6/17 10:22.
 */
module.exports = {
    //  "dburl" : "mongodb://223.2.47.107:27017/VgeDataServicesDB",
    dburl: "mongodb://223.2.42.18:27017/VgeDataSharingDB",

    // 本机IP，用于注册门户的门户的时候，发送给门户。为什么这么干？为了和远程节点注册接口的统一，远程接口也是通过本机发的请求，如果门户根据remote host获取ip则总是获取本机ip，无法区分本机的远程节点和本机。
    host: '223.2.42.87',
    port: '8899',

    portalhost:'222.192.75.75',
    portalport:'80',

    // 数据位置配置
    'data_basedir': '',
    'datamap_basedir': '',
    'refactor_basedir': '',
    public_net_server:'http://111.229.14.128:8899/publicdata',


}