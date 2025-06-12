/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2024-12-20 16:00:01
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-11 11:45:20
 * @FilePath: /applet/Api/user/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//用户信息部分
const express = require('express');
const router = express.Router();
const db = require('../link.js');

const sqlErr = {
    code: 500,
    msg: '数据库错误'
}
// 封装固定格式的返回体
const tw = (res, code, msg) => {
    res.send({
        'code': code,
        'msg': msg
    })
}

router.get('/admin_info', (req, res) => {
    // 从请求头中获取 Token
  const token = req.headers['token'] ? req.headers['token'] : null;
  // 已删除无用的测试代码
  console.log(token, req.headers)
    const sql = `SELECT id,username,name,state,permissions,token FROM users where token = '${token}'`;
    console.log(sql)
    db.query(sql, (err, data) => {
        console.log('data', data, `'${token}'`)
        if (err) {
            tw(res, 500, '数据库错误');
        } else if (data.length == 0) {
            tw(res, 404, '数据不存在');
        } else {
            if (data[0].permissions) {
                data[0].permissions = JSON.parse(data[0].permissions);
              }
            res.send({ code: 200, msg: '获取成功', result: data[0] })
        }
    })
})

module.exports = router;