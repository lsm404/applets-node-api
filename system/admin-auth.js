const express = require('express');
const router = express.Router();
const db = require('../link.js');
const md5 = require('../loginReg/enc.js');
const jwt = require('jsonwebtoken');

const sqlErr = {
    code: 500,
    msg: '数据库错误'
};

// 封装返回格式
const respond = (res, code, msg, data = null) => {
    res.send({
        code: code,
        msg: msg,
        data: data
    });
};

// 管理员登录
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return respond(res, 400, '用户名和密码不能为空');
    }
    
    const hashedPassword = md5(password);
    
    // 查询管理员信息
    const sql = `SELECT id, admin_name, username, email, role, permissions, status 
                 FROM administrators 
                 WHERE username = ? AND password = ?`;
    
    db.query(sql, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('登录查询失败:', err);
            return res.send(sqlErr);
        }
        
        if (results.length === 0) {
            return respond(res, 401, '用户名或密码错误');
        }
        
        const admin = results[0];
        
        if (admin.status === 0) {
            return respond(res, 403, '账号已被禁用');
        }
        
        // 生成JWT token
        const tokenPayload = {
            id: admin.id,
            username: admin.username,
            role: admin.role,
            permissions: JSON.parse(admin.permissions || '[]')
        };
        
        const token = jwt.sign(tokenPayload, 'moyc^-^', { expiresIn: '24h' });
        
        // 更新登录信息
        const updateSql = `UPDATE administrators 
                          SET token = ?, last_login_time = NOW(), last_login_ip = ? 
                          WHERE id = ?`;
        
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        
        db.query(updateSql, [token, clientIP, admin.id], (updateErr) => {
            if (updateErr) {
                console.error('更新登录信息失败:', updateErr);
            }
        });
        
        respond(res, 200, '登录成功', {
            token: token,
            admin: {
                id: admin.id,
                name: admin.admin_name,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: JSON.parse(admin.permissions || '[]')
            }
        });
    });
});

// 获取当前管理员信息
router.get('/admin/profile', (req, res) => {
    const adminId = req.user.id;
    
    const sql = `SELECT id, admin_name, username, email, role, permissions, avatar,
                        last_login_time, createTime 
                 FROM administrators 
                 WHERE id = ? AND status = 1`;
    
    db.query(sql, [adminId], (err, results) => {
        if (err) {
            console.error('获取管理员信息失败:', err);
            return res.send(sqlErr);
        }
        
        if (results.length === 0) {
            return respond(res, 404, '管理员不存在');
        }
        
        const admin = results[0];
        respond(res, 200, '获取成功', {
            id: admin.id,
            name: admin.admin_name,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            permissions: JSON.parse(admin.permissions || '[]'),
            avatar: admin.avatar || '/images/default/admin.jpeg',
            lastLoginTime: admin.last_login_time,
            createTime: admin.createTime
        });
    });
});

// 管理员退出登录
router.post('/admin/logout', (req, res) => {
    const adminId = req.user.id;
    
    // 清除token
    const sql = `UPDATE administrators SET token = NULL WHERE id = ?`;
    
    db.query(sql, [adminId], (err) => {
        if (err) {
            console.error('退出登录失败:', err);
            return res.send(sqlErr);
        }
        
        respond(res, 200, '退出登录成功');
    });
});

// 修改管理员密码
router.put('/admin/password', (req, res) => {
    const adminId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
        return respond(res, 400, '旧密码和新密码不能为空');
    }
    
    if (newPassword.length < 6) {
        return respond(res, 400, '新密码长度不能少于6位');
    }
    
    const oldHashedPassword = md5(oldPassword);
    const newHashedPassword = md5(newPassword);
    
    // 验证旧密码
    const checkSql = `SELECT id FROM administrators WHERE id = ? AND password = ?`;
    
    db.query(checkSql, [adminId, oldHashedPassword], (err, results) => {
        if (err) {
            console.error('验证旧密码失败:', err);
            return res.send(sqlErr);
        }
        
        if (results.length === 0) {
            return respond(res, 400, '旧密码错误');
        }
        
        // 更新密码
        const updateSql = `UPDATE administrators SET password = ? WHERE id = ?`;
        
        db.query(updateSql, [newHashedPassword, adminId], (updateErr) => {
            if (updateErr) {
                console.error('更新密码失败:', updateErr);
                return res.send(sqlErr);
            }
            
            respond(res, 200, '密码修改成功');
        });
    });
});

module.exports = router; 