/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2024-12-20 16:00:01
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-11 11:54:08
 * @FilePath: /applet/Api/link.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mysql = require('mysql')
const appConfig = require('./config/index');
const config = appConfig.database;
let db;

// 创建连接池而不是单一连接
const pool = mysql.createPool({
    ...config,
    connectionLimit: 10,
    acquireTimeout: 30000,
    waitForConnections: true
});

// 导出查询方法而不是连接对象
module.exports = {
    query: function(sql, params, callback) {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log('获取数据库连接失败: ', err);
                return callback(err);
            }
            
            connection.query(sql, params, function(error, results, fields) {
                // 释放连接
                connection.release();
                
                // 回调返回结果
                if (error) {
                    return callback(error);
                }
                callback(null, results, fields);
            });
        });
    }
};
