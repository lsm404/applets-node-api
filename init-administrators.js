/*
 * 管理员表初始化脚本
 * 运行此脚本来创建administrators表和初始化超级管理员账号
 */

const mysql = require('mysql');
const md5 = require('./loginReg/enc.js');
const appConfig = require('./config/index');

const config = appConfig.database;

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('✅ 数据库连接成功');
    
    // 创建administrators表的SQL
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS \`administrators\` (
            \`id\` int(11) NOT NULL AUTO_INCREMENT,
            \`admin_name\` varchar(50) NOT NULL COMMENT '管理员名称',
            \`username\` varchar(50) NOT NULL COMMENT '登录用户名',
            \`password\` varchar(255) NOT NULL COMMENT '密码(MD5加密)',
            \`email\` varchar(100) NOT NULL COMMENT '邮箱',
            \`phone\` varchar(20) DEFAULT NULL COMMENT '手机号',
            \`avatar\` varchar(255) DEFAULT NULL COMMENT '头像',
            \`role\` varchar(20) DEFAULT 'admin' COMMENT '管理员角色: superadmin-超级管理员 admin-普通管理员',
            \`permissions\` text COMMENT '权限列表(JSON格式)',
            \`status\` tinyint(1) DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
            \`last_login_time\` timestamp NULL COMMENT '最后登录时间',
            \`last_login_ip\` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
            \`token\` text COMMENT 'JWT令牌',
            \`createTime\` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
            \`updateTime\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`username\` (\`username\`),
            UNIQUE KEY \`email\` (\`email\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';
    `;
    
    console.log('🔧 正在创建administrators表...');
    
    connection.query(createTableSQL, (err) => {
        if (err) {
            console.error('❌ 创建表失败:', err);
            connection.end();
            return;
        }
        
        console.log('✅ administrators表创建成功');
        
        // 检查是否已存在超级管理员
        const checkAdminSQL = `SELECT id FROM administrators WHERE username = 'superadmin'`;
        
        connection.query(checkAdminSQL, (err, results) => {
            if (err) {
                console.error('❌ 检查管理员失败:', err);
                connection.end();
                return;
            }
            
            if (results.length > 0) {
                console.log('ℹ️  超级管理员已存在，跳过创建');
                connection.end();
                return;
            }
            
            // 创建超级管理员账号
            const superadminPassword = md5('admin123'); // 默认密码 admin123
            const normalAdminPassword = md5('admin123'); 
            
            const insertAdminsSQL = `
                INSERT INTO \`administrators\` (\`admin_name\`, \`username\`, \`password\`, \`email\`, \`phone\`, \`avatar\`, \`role\`, \`permissions\`, \`status\`) VALUES
                ('超级管理员', 'superadmin', ?, 'super@admin.com', '13900139000', '/images/default/admin.jpeg', 'superadmin', '["all"]', 1),
                ('工具管理员', 'tooladmin', ?, 'tool@admin.com', '13900139001', '/images/default/admin.jpeg', 'admin', '["tools", "upload"]', 1)
            `;
            
            console.log('👤 正在创建管理员账号...');
            
            connection.query(insertAdminsSQL, [superadminPassword, normalAdminPassword], (err) => {
                if (err) {
                    console.error('❌ 创建管理员账号失败:', err);
                } else {
                    console.log('✅ 管理员账号创建成功!');
                    console.log('');
                    console.log('🎉 初始化完成！管理员账号信息：');
                    console.log('========================');
                    console.log('超级管理员:');
                    console.log('  用户名: superadmin');
                    console.log('  密码: admin123');
                    console.log('  权限: 全部权限');
                    console.log('');
                    console.log('普通管理员:');
                    console.log('  用户名: tooladmin');
                    console.log('  密码: admin123');
                    console.log('  权限: 工具管理和上传');
                    console.log('========================');
                }
                
                connection.end();
            });
        });
    });
}); 