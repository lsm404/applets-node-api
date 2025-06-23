/*
 * 权限控制中间件
 * 用于检查管理员权限，确保只有特定角色才能访问某些接口
 */

const db = require('../link.js');

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

/**
 * 检查是否为超级管理员
 * 只有superadmin角色才能通过
 */
const requireSuperAdmin = (req, res, next) => {
    // 检查JWT是否已验证
    if (!req.user) {
        return respond(res, 401, '请先登录');
    }
    
    const { id, username, role } = req.user;
    
    // 检查角色是否为superadmin
    if (role !== 'superadmin') {
        return respond(res, 403, '权限不足，仅超级管理员可操作');
    }
    
    // 从数据库再次验证用户状态（可选，增加安全性）
    const sql = `SELECT id, role, status FROM administrators WHERE id = ? AND username = ?`;
    
    db.query(sql, [id, username], (err, results) => {
        if (err) {
            console.error('验证管理员状态失败:', err);
            return res.send(sqlErr);
        }
        
        if (results.length === 0) {
            return respond(res, 401, '管理员账号不存在');
        }
        
        const admin = results[0];
        
        if (admin.status === 0) {
            return respond(res, 403, '账号已被禁用');
        }
        
        if (admin.role !== 'superadmin') {
            return respond(res, 403, '权限不足，仅超级管理员可操作');
        }
        
        // 验证通过，继续执行
        next();
    });
};

/**
 * 检查是否为管理员（包括superadmin和admin）
 */
const requireAdmin = (req, res, next) => {
    // 检查JWT是否已验证
    if (!req.user) {
        return respond(res, 401, '请先登录');
    }
    
    const { id, username, role } = req.user;
    
    // 检查角色是否为管理员
    if (role !== 'superadmin' && role !== 'admin') {
        return respond(res, 403, '权限不足，仅管理员可操作');
    }
    
    // 从数据库再次验证用户状态
    const sql = `SELECT id, role, status FROM administrators WHERE id = ? AND username = ?`;
    
    db.query(sql, [id, username], (err, results) => {
        if (err) {
            console.error('验证管理员状态失败:', err);
            return res.send(sqlErr);
        }
        
        if (results.length === 0) {
            return respond(res, 401, '管理员账号不存在');
        }
        
        const admin = results[0];
        
        if (admin.status === 0) {
            return respond(res, 403, '账号已被禁用');
        }
        
        if (admin.role !== 'superadmin' && admin.role !== 'admin') {
            return respond(res, 403, '权限不足，仅管理员可操作');
        }
        
        // 验证通过，继续执行
        next();
    });
};

/**
 * 检查特定权限
 * @param {string|array} permissions - 需要的权限
 */
const requirePermission = (permissions) => {
    return (req, res, next) => {
        // 检查JWT是否已验证
        if (!req.user) {
            return respond(res, 401, '请先登录');
        }
        
        const { id, username, role, permissions: userPermissions } = req.user;
        
        // 超级管理员拥有所有权限
        if (role === 'superadmin') {
            return next();
        }
        
        // 检查用户权限
        const requiredPerms = Array.isArray(permissions) ? permissions : [permissions];
        const hasPermission = requiredPerms.some(perm => 
            userPermissions && userPermissions.includes(perm)
        );
        
        if (!hasPermission) {
            return respond(res, 403, `权限不足，需要以下权限之一: ${requiredPerms.join(', ')}`);
        }
        
        // 验证通过，继续执行
        next();
    };
};

/**
 * 获取用户权限信息（用于前端权限控制）
 */
const getUserPermissions = (req, res) => {
    if (!req.user) {
        return respond(res, 401, '请先登录');
    }
    
    const { role, permissions } = req.user;
    
    // 超级管理员拥有所有权限
    if (role === 'superadmin') {
        return respond(res, 200, '获取成功', {
            role: 'superadmin',
            permissions: ['all'],
            isSuperAdmin: true,
            canDeleteTools: true,
            canEditTools: true,
            canAddTools: true,
            canManageUsers: true,
            canManageSettings: true
        });
    }
    
    // 普通管理员权限
    const hasToolsPermission = permissions && permissions.includes('tools');
    const hasUploadPermission = permissions && permissions.includes('upload');
    
    respond(res, 200, '获取成功', {
        role: role,
        permissions: permissions || [],
        isSuperAdmin: false,
        canDeleteTools: hasToolsPermission,
        canEditTools: hasToolsPermission,
        canAddTools: hasToolsPermission,
        canManageUsers: false,
        canManageSettings: false
    });
};

module.exports = {
    requireSuperAdmin,
    requireAdmin,
    requirePermission,
    getUserPermissions
}; 