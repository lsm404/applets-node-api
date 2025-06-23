const express = require('express');
const router = express.Router();
const db = require('../link.js');
const { requireSuperAdmin, requireAdmin, requirePermission } = require('../middleware/auth.js');

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

// 获取分类列表 (支持分页和搜索)
router.get('/categories', (req, res) => {
    const { page = 1, pageSize = 50, name, status } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = '';
    let params = [];
    let conditions = [];
    
    // 处理名称搜索
    if (name) {
        conditions.push('name LIKE ?');
        params.push(`%${name}%`);
    }
    
    // 处理状态筛选
    if (status !== undefined && status !== null && status !== '' && status !== 'null') {
        conditions.push('status = ?');
        params.push(parseInt(status));
    }
    
    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
    }
    
    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM tool_categories ${whereClause}`;
    db.query(countSql, params, (err, countResult) => {
        if (err) {
            console.error('查询分类总数失败:', err);
            return res.send(sqlErr);
        }
        
        const total = countResult[0].total;
        
        // 查询列表数据
        const listSql = `SELECT * FROM tool_categories ${whereClause} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`;
        const listParams = [...params, parseInt(pageSize), parseInt(offset)];
        
        db.query(listSql, listParams, (listErr, listResult) => {
            if (listErr) {
                console.error('查询分类列表失败:', listErr);
                return res.send(sqlErr);
            }
            
            // 返回带分页信息的数据
            res.json({
                code: 200,
                msg: '获取成功',
                data: listResult,
                count: total,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            });
        });
    });
});

// 获取所有启用的分类（供下拉选择用）
router.get('/categories/options', (req, res) => {
    const sql = 'SELECT id as value, name as label FROM tool_categories WHERE status = 1 ORDER BY sort_order ASC, id ASC';
    
    db.query(sql, [], (err, result) => {
        if (err) {
            console.error('查询分类选项失败:', err);
            return res.send(sqlErr);
        }
        
        respond(res, 200, '获取成功', result);
    });
});

// 获取单个分类详情
router.get('/categories/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'SELECT * FROM tool_categories WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('查询分类详情失败:', err);
            return res.send(sqlErr);
        }
        
        if (result.length === 0) {
            return respond(res, 404, '分类不存在');
        }
        
        respond(res, 200, '获取成功', result[0]);
    });
});

// 添加分类 - 仅超级管理员可操作
router.post('/categories', requireSuperAdmin, (req, res) => {
    const { name, sort_order = 0, status = 1 } = req.body;
    
    if (!name) {
        return respond(res, 400, '分类名称不能为空');
    }
    
    // 检查是否已存在相同名称的分类
    db.query('SELECT id FROM tool_categories WHERE name = ?', [name], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('检查分类名称失败:', checkErr);
            return res.send(sqlErr);
        }
        
        if (checkResult.length > 0) {
            return respond(res, 400, '已存在相同名称的分类');
        }
        
        const sql = `INSERT INTO tool_categories (name, sort_order, status) VALUES (?, ?, ?)`;
        
        db.query(sql, [name, sort_order, status], (err, result) => {
            if (err) {
                console.error('添加分类失败:', err);
                return res.send(sqlErr);
            }
            
            respond(res, 200, '添加成功', { id: result.insertId });
        });
    });
});

// 更新分类 - 仅超级管理员可操作
router.put('/categories/:id', requireSuperAdmin, (req, res) => {
    const { id } = req.params;
    const { name, sort_order, status } = req.body;
    
    if (!name) {
        return respond(res, 400, '分类名称不能为空');
    }
    
    // 检查是否已存在相同名称的其他分类
    db.query('SELECT id FROM tool_categories WHERE name = ? AND id != ?', [name, id], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('检查分类名称失败:', checkErr);
            return res.send(sqlErr);
        }
        
        if (checkResult.length > 0) {
            return respond(res, 400, '已存在相同名称的分类');
        }
        
        const sql = `UPDATE tool_categories SET name = ?, sort_order = ?, status = ?,
                    updateTime = CURRENT_TIMESTAMP WHERE id = ?`;
        
        db.query(sql, [name, sort_order, status, id], (err, result) => {
            if (err) {
                console.error('更新分类失败:', err);
                return res.send(sqlErr);
            }
            
            if (result.affectedRows === 0) {
                return respond(res, 404, '分类不存在');
            }
            
            respond(res, 200, '更新成功');
        });
    });
});

// 删除分类 - 仅超级管理员可操作
router.delete('/categories/:id', requireSuperAdmin, (req, res) => {
    const { id } = req.params;
    
    // 检查是否有工具在使用此分类
    db.query('SELECT COUNT(*) as count FROM tools WHERE category = ?', [id], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('检查分类使用情况失败:', checkErr);
            return res.send(sqlErr);
        }
        
        if (checkResult[0].count > 0) {
            return respond(res, 400, `无法删除，有${checkResult[0].count}个工具正在使用此分类`);
        }
        
        const sql = 'DELETE FROM tool_categories WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('删除分类失败:', err);
                return res.send(sqlErr);
            }
            
            if (result.affectedRows === 0) {
                return respond(res, 404, '分类不存在');
            }
            
            respond(res, 200, '删除成功');
        });
    });
});

// 更新分类状态 - 仅超级管理员可操作
router.patch('/categories/:id/status', requireSuperAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (status === undefined || ![0, 1].includes(status)) {
        return respond(res, 400, '状态值无效');
    }
    
    const sql = 'UPDATE tool_categories SET status = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('更新分类状态失败:', err);
            return res.send(sqlErr);
        }
        
        if (result.affectedRows === 0) {
            return respond(res, 404, '分类不存在');
        }
        
        respond(res, 200, '状态更新成功');
    });
});

module.exports = router; 