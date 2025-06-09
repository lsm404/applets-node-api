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
  const sql1 = `SELECT id,username,name,state FROM users where token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTczNDY4NjQzNiwiZXhwIjoxNzM1MjkxMjM2fQ.mKLKlHas84DBANDJ0EfZvKXHSlSLVw67mUYX4E9cjZc'`;
  db.query(sql1, (err, data) => {
    console.log('data1', data)
})
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