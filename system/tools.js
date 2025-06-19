const express = require('express');
const router = express.Router();
const db = require('../link.js')

const sqlErr = {
    code: 500,
    msg: '数据库错误'
}

//获取工具列表（支持分类筛选）
router.get('/tools', (req, res) => {
    const category = req.query.category; // 从查询参数获取分类
    let sql, countSql;
    let params = [];
    
    if (category && category !== '0') {
        // 按指定分类查询
        sql = `SELECT * FROM tools WHERE status = 1 AND category = ? ORDER BY id ASC`;
        countSql = `SELECT count(*) as count FROM tools WHERE status = 1 AND category = ?`;
        params = [category];
    } else {
        // 查询全部（category = 0 或未指定）
        sql = `SELECT * FROM tools WHERE status = 1 ORDER BY id ASC`;
        countSql = `SELECT count(*) as count FROM tools WHERE status = 1`;
    }
    
    db.query(sql, params, (err, data) => {
        if (err) {
            console.error('查询工具列表失败:', err);
            res.send(sqlErr);
        } else {
            db.query(countSql, params, (err, countData) => {
                if (err) {
                    console.error('查询工具数量失败:', err);
                    res.send(sqlErr);
                } else {
                    res.send({
                        code: 200,
                        msg: '获取成功',
                        category: category || '0',
                        count: countData[0].count,
                        data: data
                    });
                }
            });
        }
    });
})

//根据ID获取单个工具详情
router.get('/tools/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM tools WHERE id = ? AND status = 1`;
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('查询工具详情失败:', err);
            res.send(sqlErr);
        } else {
            if (data.length === 0) {
                res.send({
                    code: 404,
                    msg: '工具不存在'
                });
            } else {
                res.send({
                    code: 200,
                    msg: '获取成功',
                    data: data[0]
                });
            }
        }
    });
})

//获取工具分类列表（如果需要按iconClass分类）
router.get('/tools/category/:category', (req, res) => {
    const category = req.params.category;
    const sql = `SELECT * FROM tools WHERE iconClass = ? AND status = 1 ORDER BY id ASC`;
    db.query(sql, [category], (err, data) => {
        if (err) {
            console.error('查询分类工具失败:', err);
            res.send(sqlErr);
        } else {
            let countSql = `SELECT count(*) as count FROM tools WHERE iconClass = ? AND status = 1`;
            db.query(countSql, [category], (err, countData) => {
                if (err) {
                    console.error('查询分类工具数量失败:', err);
                    res.send(sqlErr);
                } else {
                    res.send({
                        code: 200,
                        msg: '获取成功',
                        count: countData[0].count,
                        data: data
                    });
                }
            });
        }
    });
})

//添加新工具（ID自动生成）
router.post('/tools', (req, res) => {
    const { title, size, desc, version, iconClass, iconPath, link, category } = req.body;
    
    // 验证必需字段
    if (!title) {
        return res.send({
            code: 400,
            msg: '工具名称不能为空'
        });
    }
    
    // 默认分类为0
    const toolCategory = category || 0;
    
    // 插入数据，不指定id，让其自动生成
    const sql = `INSERT INTO tools (title, size, \`desc\`, version, iconClass, iconPath, link, category, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;
    
    db.query(sql, [title, size, desc, version, iconClass, iconPath, link, toolCategory], (err, result) => {
        if (err) {
            console.error('添加工具失败:', err);
            res.send(sqlErr);
        } else {
            // 返回新插入的记录（包含自动生成的ID）
            const newId = result.insertId;
            const selectSql = `SELECT * FROM tools WHERE id = ?`;
            db.query(selectSql, [newId], (err, data) => {
                if (err) {
                    console.error('查询新添加的工具失败:', err);
                    res.send(sqlErr);
                } else {
                    res.send({
                        code: 200,
                        msg: '添加成功',
                        data: data[0]
                    });
                }
            });
        }
    });
})

//更新工具信息
router.put('/tools/:id', (req, res) => {
    const id = req.params.id;
    const { title, size, desc, version, iconClass, iconPath, link, category, status } = req.body;
    
    const sql = `UPDATE tools SET title = ?, size = ?, \`desc\` = ?, version = ?, 
                 iconClass = ?, iconPath = ?, link = ?, category = ?, status = ? WHERE id = ?`;
    
    db.query(sql, [title, size, desc, version, iconClass, iconPath, link, category, status, id], (err, result) => {
        if (err) {
            console.error('更新工具失败:', err);
            res.send(sqlErr);
        } else {
            if (result.affectedRows === 0) {
                res.send({
                    code: 404,
                    msg: '工具不存在'
                });
            } else {
                // 返回更新后的记录
                const selectSql = `SELECT * FROM tools WHERE id = ?`;
                db.query(selectSql, [id], (err, data) => {
                    if (err) {
                        console.error('查询更新后的工具失败:', err);
                        res.send(sqlErr);
                    } else {
                        res.send({
                            code: 200,
                            msg: '更新成功',
                            data: data[0]
                        });
                    }
                });
            }
        }
    });
})

//删除工具（软删除，设置status为0）
router.delete('/tools/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE tools SET status = 0 WHERE id = ?`;
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('删除工具失败:', err);
            res.send(sqlErr);
        } else {
            if (result.affectedRows === 0) {
                res.send({
                    code: 404,
                    msg: '工具不存在'
                });
            } else {
                res.send({
                    code: 200,
                    msg: '删除成功'
                });
            }
        }
    });
})

//搜索工具接口
router.get('/tools/search', (req, res) => {
    const { keyword, page = 1, pageSize = 10 } = req.query;
    
    // 验证搜索关键词
    if (!keyword || keyword.trim() === '') {
        return res.send({
            code: 400,
            msg: '搜索关键词不能为空'
        });
    }
    
    const searchKeyword = `%${keyword.trim()}%`;
    const offset = (page - 1) * pageSize;
    
    // 搜索SQL，支持标题、描述、版本号模糊搜索
    const searchSql = `
        SELECT * FROM tools 
        WHERE status = 1 AND (
            title LIKE ? OR 
            \`desc\` LIKE ? OR 
            version LIKE ?
        ) 
        ORDER BY 
            CASE 
                WHEN title LIKE ? THEN 1
                WHEN \`desc\` LIKE ? THEN 2
                ELSE 3
            END,
            createTime DESC
        LIMIT ? OFFSET ?
    `;
    
    // 统计SQL
    const countSql = `
        SELECT COUNT(*) as count FROM tools 
        WHERE status = 1 AND (
            title LIKE ? OR 
            \`desc\` LIKE ? OR 
            version LIKE ?
        )
    `;
    
    const searchParams = [searchKeyword, searchKeyword, searchKeyword, searchKeyword, searchKeyword, parseInt(pageSize), parseInt(offset)];
    const countParams = [searchKeyword, searchKeyword, searchKeyword];
    
    // 先查询总数
    db.query(countSql, countParams, (err, countResult) => {
        if (err) {
            console.error('搜索工具总数失败:', err);
            return res.send(sqlErr);
        }
        
        const total = countResult[0].count;
        
        // 查询搜索结果
        db.query(searchSql, searchParams, (err, searchResult) => {
            if (err) {
                console.error('搜索工具失败:', err);
                return res.send(sqlErr);
            }
            
            res.send({
                code: 200,
                msg: '搜索成功',
                data: searchResult,
                count: total,
                keyword: keyword,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            });
        });
    });
})

module.exports = router; 