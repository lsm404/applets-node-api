const mysql = require('mysql')
const config = {
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01',
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




