const mysql = require('mysql');
const md5 = require('./loginReg/enc.js');

// 使用与link.js相同的配置
const config = {
    host: 'localhost',
    user: 'db',
    password: 'admin123',
    database: 'db',
    timezone: "SYSTEM"
};

console.log('正在连接数据库...');

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
    
    // 测试查询管理员
    const hashedPassword = md5('admin123');
    console.log('MD5密码:', hashedPassword);
    
    const sql = `SELECT * FROM administrators WHERE username = ? AND password = ?`;
    
    connection.query(sql, ['superadmin', hashedPassword], (error, results) => {
        if (error) {
            console.error('查询失败:', error);
        } else {
            console.log('查询结果:', results);
            if (results.length > 0) {
                console.log('管理员验证成功');
            } else {
                console.log('管理员不存在或密码错误');
            }
        }
        
        connection.end();
    });
}); 