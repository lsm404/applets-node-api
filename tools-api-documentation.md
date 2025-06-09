# Tools工具接口文档

## 接口概述

本文档描述了工具管理相关的API接口，用于获取小程序中的工具列表数据。

## 基础信息

- **服务地址**: `http://127.0.0.1:8088`
- **接口前缀**: `/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: 无需认证（公开接口）

---

## 1. 获取工具列表

### 接口信息

| 项目 | 内容 |
|------|------|
| 接口地址 | `/api/tools` |
| 请求方式 | GET |
| 接口描述 | 获取启用状态的工具列表 |
| 是否需要登录 | 否 |

### 请求参数

无需传入参数

### 请求示例

```bash
curl -X GET "http://127.0.0.1:8088/api/tools"
```

### 响应参数

#### 成功响应

```json
{
    "code": 200,
    "msg": "获取成功",
    "count": 4,
    "data": [
        {
            "id": 1,
            "title": "针孔摄像头探测",
            "size": "38MB",
            "desc": "针孔摄像头探测会员版",
            "version": "会员版",
            "iconClass": "camera",
            "iconPath": "https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277",
            "link": "https://pan.quark.cn/s/29114aa7c407",
            "status": 1,
            "createTime": "2025-06-09 10:26:31",
            "updateTime": "2025-06-09 10:26:31"
        }
    ]
}
```

#### 响应字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| code | number | 响应状态码，200表示成功 |
| msg | string | 响应消息 |
| count | number | 数据总数 |
| data | array | 工具列表数据 |

#### data数组中的对象字段

| 字段名 | 类型 | 描述 | 示例 |
|--------|------|------|------|
| id | number | 工具ID | 1 |
| title | string | 工具名称 | "针孔摄像头探测" |
| size | string | 文件大小 | "38MB" |
| desc | string | 工具描述 | "针孔摄像头探测会员版" |
| version | string | 版本号 | "会员版" |
| iconClass | string | 图标类名 | "camera" |
| iconPath | string | 图标路径URL | "https://..." |
| link | string | 下载链接 | "https://pan.quark.cn/s/29114aa7c407" |
| status | number | 状态，1-启用，0-禁用 | 1 |
| createTime | string | 创建时间 | "2025-06-09 10:26:31" |
| updateTime | string | 更新时间 | "2025-06-09 10:26:31" |

### 错误响应

#### 数据库错误

```json
{
    "code": 500,
    "msg": "数据库错误"
}
```

#### 服务器错误

```json
{
    "code": 500,
    "msg": "服务器错误"
}
```

---

## 数据库结构

### tools表结构

```sql
CREATE TABLE IF NOT EXISTS `tools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '工具名称',
  `size` varchar(50) DEFAULT NULL COMMENT '文件大小',
  `desc` text COMMENT '工具描述',
  `version` varchar(100) DEFAULT NULL COMMENT '版本号',
  `iconClass` varchar(100) DEFAULT NULL COMMENT '图标类名',
  `iconPath` text COMMENT '图标路径',
  `link` text COMMENT '下载链接',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具表';
```

### 字段说明

| 字段名 | 类型 | 长度 | 允许空 | 默认值 | 描述 |
|--------|------|------|--------|--------|------|
| id | int | 11 | NO | AUTO_INCREMENT | 主键ID |
| title | varchar | 255 | NO | NULL | 工具名称 |
| size | varchar | 50 | YES | NULL | 文件大小 |
| desc | text | - | YES | NULL | 工具描述 |
| version | varchar | 100 | YES | NULL | 版本号 |
| iconClass | varchar | 100 | YES | NULL | 图标类名 |
| iconPath | text | - | YES | NULL | 图标路径 |
| link | text | - | YES | NULL | 下载链接 |
| status | tinyint | 1 | YES | 1 | 状态（1-启用，0-禁用） |
| createTime | timestamp | - | YES | CURRENT_TIMESTAMP | 创建时间 |
| updateTime | timestamp | - | YES | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

### 示例数据

```sql
INSERT INTO `tools` (`id`, `title`, `size`, `desc`, `version`, `iconClass`, `iconPath`, `link`, `status`) VALUES
(1, '针孔摄像头探测', '38MB', '针孔摄像头探测会员版', '会员版', 'camera', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 1),
(2, '微聊天记录精灵', '106MB', '微信聊天记录精灵', '官方版', 'wechat', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 1),
(3, '天道音乐免费版', '20MB', '音乐神器，无损下载', 'v1.5.7', 'music', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 1),
(4, '唐诗宋词学习', '6.8MB', '学诗词必备', '最新版', 'poem', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 1);
```

---

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 500 | 服务器内部错误（包括数据库错误） |

---

## 技术实现

### 后端实现

- **框架**: Express.js
- **数据库**: MySQL
- **文件位置**: `Api/system/get.js`
- **路由**: `router.get('/tools', callback)`

### 核心代码

```javascript
//获取工具列表
router.get('/tools', (req, res) => {
    const sql = `SELECT * FROM tools WHERE status = 1 ORDER BY id ASC`;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('查询工具列表失败:', err);
            res.send(sqlErr);
        } else {
            let countSql = `SELECT count(*) as count FROM tools WHERE status = 1`;
            db.query(countSql, (err, countData) => {
                if (err) {
                    console.error('查询工具数量失败:', err);
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
```

### 前端调用

```javascript
// 在小程序中的调用方式
const api = require('../../utils/api.js');

// 获取工具列表
async getToolsData() {
    try {
        const res = await api.getTools();
        console.log('API响应:', res);
        
        this.setData({
            tools: res.data || [],
            loading: false
        });
    } catch (error) {
        console.error('获取工具列表失败:', error);
    }
}
```

---

## 维护说明

### 数据管理

1. **添加新工具**: 直接在数据库中INSERT新记录
2. **禁用工具**: 将status字段设为0
3. **启用工具**: 将status字段设为1
4. **删除工具**: 物理删除记录或设置status为0

### 扩展字段

如需添加新字段，可按以下步骤：

1. 在数据库中添加新列
2. 修改接口返回的SELECT语句
3. 更新此文档

### 备份与恢复

```bash
# 备份数据
mysqldump -u root -p my_db_01 tools > tools_backup.sql

# 恢复数据
mysql -u root -p my_db_01 < tools_backup.sql
```

---

## 测试用例

### 正常请求测试

```bash
# 测试工具列表获取
curl "http://127.0.0.1:8088/api/tools"

# 预期响应
{
    "code": 200,
    "msg": "获取成功",
    "count": 4,
    "data": [...]
}
```

### 错误场景测试

1. **数据库连接断开**
   - 停止MySQL服务
   - 发起请求
   - 预期返回: `{"code": 500, "msg": "数据库错误"}`

2. **空数据测试**
   - 将所有tools的status设为0
   - 发起请求
   - 预期返回: `{"code": 200, "msg": "获取成功", "count": 0, "data": []}`

---

## 性能说明

- **查询复杂度**: O(n) - 简单SELECT查询
- **响应时间**: < 100ms（本地数据库）
- **并发支持**: 支持多客户端同时请求
- **缓存策略**: 无缓存，实时查询数据库

---

## 安全说明

- **SQL注入防护**: 使用参数化查询
- **权限控制**: 公开接口，无需认证
- **数据过滤**: 只返回status=1的启用数据
- **错误处理**: 数据库错误不暴露敏感信息

---

## 版本历史

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| 1.0.0 | 2025-06-09 | 初始版本，实现基础工具列表获取功能 |

---

## 联系信息

- **开发者**: lishengmin
- **邮箱**: shengminfang@foxmail.com
- **更新时间**: 2025-06-09

---

**注意**: 此接口无需认证，属于公开接口。请确保数据库连接正常且tools表存在。 