// 目录列表
const express = require("express");
const router = express.Router();
const db = require("../link.js");

const sqlErr = {
  code: 500,
  msg: "数据库错误",
};
// 封装固定格式的返回体
const tw = (res, code, msg) => {
  res.send({
    code: code,
    msg: msg,
  });
};

function isEmptyStr(s) {
  if (s == null || s === "") {
    return false;
  }
  return true;
}

router.get("/catalogueList", (req, res) => {
  let sql = `select * from catalogueList`;
  db.query(sql, (err, data) => {
    if (err) return res.send(sqlErr);
    if (data.length == 0) {
      tw(res, 403, "您没有权限");
    } else {
      // data.forEach(item => {
      //   item.option = JSON.parse(item.option)
      // })
      res.send({
        code: 200,
        msg: "获取成功",
        count: data[0].count,
        result: {
          list: data,
        },
      });
    }
  });
});

router.post("/editCatalogue", (req, res) => {
  if (!isEmptyStr(req.body.id)) {
    tw(res, 401, "参数异常");
  } else {
    const { name, status, option, id } = req.body;

    // 创建一个对象来存储要更新的字段和值
    const updateFields = {};

    // 检查每个字段是否有值，如果有则添加到 updateFields 对象中
    if (name !== undefined && name !== null && name !== "") {
      updateFields.name = name;
    }

    if (status !== undefined && status !== null && status !== "") {
      updateFields.status = status;
    }

    if (option !== undefined && option !== null && typeof option === "object") {
      try {
        // 将 JavaScript 对象转换为 JSON 字符串
        const jsonOption = JSON.stringify(option);

        // 验证 JSON 是否有效
        JSON.parse(jsonOption); // 如果解析失败，会抛出异常

        updateFields.option = jsonOption;
      } catch (error) {
        return res.status(400).json({ error: "无效的 JSON 格式" });
      }
    }

    // 如果没有任何字段需要更新，返回错误
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "没有提供要更新的字段" });
    }
    // 构建 SET 子句
    const setClause = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");

    // 构建完整的 SQL 语句
    const sql = `UPDATE catalogueList SET ${setClause} WHERE id = ?`;

    // 构建参数数组，包括所有要更新的值以及 id
    const params = [...Object.values(updateFields), id];

    // let sql = `update catalogueList set status = ${req.body.status} where id = ${req.body.id}`
    db.query(sql, params, (err, results) => {
      console.log("results::::::", results);
      if (err) return res.send(sqlErr);
      res.send({
        code: 200,
        msg: "编辑成功",
      });
    });
  }
});

router.post("/addCatalogue", (req, res) => {
  if (!isEmptyStr(req.body.name) || !isEmptyStr(req.body.routers)) {
    tw(res, 401, "参数异常");
  } else {
    let sql =
      "INSERT INTO catalogueList (name, `option`, status) VALUES (?, ?, ?)";
    console.log(sql);
    db.query(
      sql,
      [req.body.name, req.body.routers, req.body.status],
      (err, results) => {
        if (err) return res.send(sqlErr);
        res.send({
          code: 200,
          msg: "添加成功",
        });
      }
    );
  }
});

router.post("/deleteCatalogue", (req, res) => {
  if (!isEmptyStr(req.body.id)) {
    tw(res, 401, "参数异常");
  } else {
    const sql = "DELETE FROM catalogueList WHERE id = ?";
    db.query(sql, [req.body.id], (err, results) => {
      if (err) return res.send(sqlErr);
      res.send({
        code: 200,
        msg: "删除成功",
      });
    });
  }
});

module.exports = router;
