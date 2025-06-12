const express = require('express');
const router = express.Router();
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

// 获取工具列表 (支持分页和搜索)
router.get('/tools', (req, res) => {
    const { page = 1, pageSize = 10, title, category } = req.query;
    const offset = (page - 1) * pageSize;
    
    let whereClause = '';
    let params = [];
    let conditions = [];
    
    // 处理标题搜索
    if (title) {
        conditions.push('title LIKE ?');
        params.push(`%${title}%`);
    }
    
    // 处理分类筛选
    // 只有当category参数存在且不为空字符串时才进行分类筛选
    // category=0或未传递category参数时，查询全部分类
    if (category !== undefined && category !== null && category !== '' && category !== 'null') {
        const categoryValue = parseInt(category);
        // 只有当category不为0时才添加分类筛选条件
        if (categoryValue !== 0) {
            conditions.push('category = ?');
            params.push(categoryValue);
        }
    }
    
    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
    }
    
    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM tools ${whereClause}`;
    db.query(countSql, params, (err, countResult) => {
        if (err) {
            console.error('查询工具总数失败:', err);
            return res.send(sqlErr);
        }
        
        const total = countResult[0].total;
        
        // 查询列表数据
        const listSql = `SELECT * FROM tools ${whereClause} ORDER BY createTime DESC LIMIT ? OFFSET ?`;
        const listParams = [...params, parseInt(pageSize), parseInt(offset)];
        
        db.query(listSql, listParams, (listErr, listResult) => {
            if (listErr) {
                console.error('查询工具列表失败:', listErr);
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

// 获取单个工具详情
router.get('/tools/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'SELECT * FROM tools WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('查询工具详情失败:', err);
            return res.send(sqlErr);
        }
        
        if (result.length === 0) {
            return respond(res, 404, '工具不存在');
        }
        
        respond(res, 200, '获取成功', result[0]);
    });
});

// 添加工具
router.post('/tools', (req, res) => {
    const { title, size, desc, version, iconClass, iconPath, link, category = 0, status = 1 } = req.body;
    
    if (!title || !link) {
        return respond(res, 400, '工具名称、描述和链接不能为空');
    }
    
    const sql = `INSERT INTO tools (title, size, \`desc\`, version, iconClass, iconPath, link, category, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [title, size, desc, version, iconClass, iconPath, link, category, status], (err, result) => {
        if (err) {
            console.error('添加工具失败:', err);
            return res.send(sqlErr);
        }
        
        respond(res, 200, '添加成功', { id: result.insertId });
    });
});

// 更新工具
router.put('/tools/:id', (req, res) => {
    const { id } = req.params;
    const { title, size, desc, version, iconClass, iconPath, link, category, status } = req.body;
    
    if (!title || !link) {
        return respond(res, 400, '工具名称、描述和链接不能为空');
    }
    
    const sql = `UPDATE tools SET title = ?, size = ?, \`desc\` = ?, version = ?, iconClass = ?, 
                 iconPath = ?, link = ?, category = ?, status = ?, updateTime = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
    
    db.query(sql, [title, size, desc, version, iconClass, iconPath, link, category, status, id], (err, result) => {
        if (err) {
            console.error('更新工具失败:', err);
            return res.send(sqlErr);
        }
        
        if (result.affectedRows === 0) {
            return respond(res, 404, '工具不存在');
        }
        
        respond(res, 200, '更新成功');
    });
});

// 删除工具
router.delete('/tools/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM tools WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('删除工具失败:', err);
            return res.send(sqlErr);
        }
        
        if (result.affectedRows === 0) {
            return respond(res, 404, '工具不存在');
        }
        
        respond(res, 200, '删除成功');
    });
});

// 批量删除工具
router.post('/tools/batch-delete', (req, res) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return respond(res, 400, '请选择要删除的工具');
    }
    
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM tools WHERE id IN (${placeholders})`;
    
    db.query(sql, ids, (err, result) => {
        if (err) {
            console.error('批量删除工具失败:', err);
            return res.send(sqlErr);
        }
        
        respond(res, 200, `成功删除 ${result.affectedRows} 个工具`);
    });
});

// 更新工具状态
router.patch('/tools/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (status === undefined || ![0, 1].includes(status)) {
        return respond(res, 400, '状态值无效');
    }
    
    const sql = 'UPDATE tools SET status = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('更新工具状态失败:', err);
            return res.send(sqlErr);
        }
        
        if (result.affectedRows === 0) {
            return respond(res, 404, '工具不存在');
        }
        
        respond(res, 200, '状态更新成功');
    });
});

module.exports = router; 