// 配置文件
const path = require('path');
const app = {
    // 数据库信息
    dbUrl: 'mongodb://localhost:27017/',
    dbName: '',
    // 静态资源信息
    resUrl: path.join(__dirname, '/public')
};

module.exports = app;