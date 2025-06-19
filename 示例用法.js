// 旧代码
// db.query('SELECT * FROM users', (err, results) => {...});

// 新代码
const db = require('./link');
db.query('SELECT * FROM users', [], (err, results) => {
    if (err) {
        console.error('查询失败:', err);
        return;
    }
    console.log('查询结果:', results);
});