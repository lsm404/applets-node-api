/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2024-12-20 16:00:01
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-11 11:54:08
 * @FilePath: /applet/Api/link.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mysql = require('mysql')
const config = {
    host: '120.46.28.146',
    user: 'db',
    password: 'admin123',
    database: 'db',
    timezone: "SYSTEM"
}
let db;

//当连接关闭时，重新连接数据库
function handleDisconnect() {
    db = mysql.createConnection(config);
    
    db.connect(function(err) {
        if (err) {
            console.log('数据库连接失败: ', err);
            console.log('将在2秒后重试...');
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('数据库连接成功');
        }
    });
    
    db.on('error', function(err) {
        console.log('数据库连接错误: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('数据库连接丢失，正在重新连接...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

// 尝试初始化数据库连接，但不阻塞服务启动
try {
    handleDisconnect();
} catch (error) {
    console.log('数据库连接失败，但服务仍将启动: ', error.message);
}




module.exports = db;




