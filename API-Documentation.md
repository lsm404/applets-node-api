<!--
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-06-09 14:53:09
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-09 14:56:36
 * @FilePath: /applet/Api/API-Documentation.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# WeChat Mini-Program API Documentation

## 目录
- [1. 工具管理接口](#1-工具管理接口)
- [2. 图片上传接口](#2-图片上传接口)
- [3. 公共说明](#3-公共说明)

---

## 1. 工具管理接口

### 1.1 获取工具列表（支持分类筛选）

**接口地址：** `GET /api/tools`

**查询参数：**
- `category` (可选): 分类ID，不传或传0时获取全部工具

**分类说明：**
- `0`: 全部/近期更新（默认值）
- `1`: 实用软件
- `2`: 影视音乐
- `3`: 万能资料

**请求示例：**
```bash
# 获取全部工具
GET /api/tools
GET /api/tools?category=0

# 获取实用软件
GET /api/tools?category=1

# 获取影视音乐
GET /api/tools?category=2

# 获取万能资料
GET /api/tools?category=3
```

**成功响应：**
```json
{
  "code": 200,
  "msg": "获取成功",
  "category": "1",
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "针孔摄像头探测",
      "size": "38MB",
      "desc": "针孔摄像头探测会员版",
      "version": "会员版",
      "iconClass": "camera",
      "iconPath": "https://...",
      "link": "https://...",
      "category": 1,
      "status": 1,
      "createTime": "2024-01-01T00:00:00.000Z",
      "updateTime": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 1.2 获取单个工具详情

**接口地址：** `GET /api/tools/:id`

**路径参数：**
- `id`: 工具ID

**请求示例：**
```bash
GET /api/tools/1
```

### 1.3 添加新工具

**接口地址：** `POST /api/tools`

**请求体：**
```json
{
  "title": "工具名称",
  "size": "文件大小",
  "desc": "工具描述",
  "version": "版本号",
  "iconClass": "图标类名",
  "iconPath": "图标路径",
  "link": "下载链接",
  "category": 1
}
```

**注意：** `category` 字段可选，不传时默认为0

### 1.4 更新工具信息

**接口地址：** `PUT /api/tools/:id`

**路径参数：**
- `id`: 工具ID

**请求体：**
```json
{
  "title": "工具名称",
  "size": "文件大小",
  "desc": "工具描述",
  "version": "版本号",
  "iconClass": "图标类名",
  "iconPath": "图标路径",
  "link": "下载链接",
  "category": 2,
  "status": 1
}
```

### 1.5 删除工具（软删除）

**接口地址：** `DELETE /api/tools/:id`

**路径参数：**
- `id`: 工具ID

**说明：** 软删除，将status设为0，不会物理删除数据

---

## 2. 图片上传接口

### 2.1 单图片上传

**接口地址：** `POST /api/upload/image`

**请求方式：** POST (multipart/form-data)

**请求参数：**
- `image` (file): 要上传的图片文件

**支持格式：** JPEG, JPG, PNG, GIF, WebP

**文件大小限制：** 5MB

**请求示例：**
```bash
curl -X POST -F "image=@/path/to/your/image.jpg" http://127.0.0.1:8088/api/upload/image
```

**成功响应：**
```json
{
  "code": 200,
  "msg": "图片上传成功",
  "data": {
    "filename": "1749451705836-444786168.jpg",
    "originalName": "image.jpg",
    "size": 102400,
    "url": "http://127.0.0.1:8088/uploads/images/1749451705836-444786168.jpg",
    "uploadTime": "2025-06-09T06:48:25.841Z"
  }
}
```

### 2.2 多图片上传

**接口地址：** `POST /api/upload/images`

**请求参数：**
- `images` (files): 要上传的多个图片文件（最多5个）

**成功响应：**
```json
{
  "code": 200,
  "msg": "图片上传成功",
  "count": 2,
  "data": [
    {
      "filename": "1749451705836-444786168.jpg",
      "originalName": "image1.jpg",
      "size": 102400,
      "url": "http://127.0.0.1:8088/uploads/images/1749451705836-444786168.jpg",
      "uploadTime": "2025-06-09T06:48:25.841Z"
    }
  ]
}
```

### 2.3 删除图片

**接口地址：** `DELETE /api/upload/image/:filename`

**路径参数：**
- `filename`: 要删除的文件名

### 2.4 获取图片信息

**接口地址：** `GET /api/upload/image/:filename/info`

**路径参数：**
- `filename`: 文件名

---

## 3. 公共说明

### 3.1 基础信息

- **API基础地址：** `http://127.0.0.1:8088`
- **认证方式：** 当前已禁用JWT认证
- **响应格式：** JSON
- **字符编码：** UTF-8

### 3.2 统一响应格式

**成功响应：**
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

**错误响应：**
```json
{
  "code": 400,
  "msg": "错误信息描述"
}
```

### 3.3 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 3.4 小程序端使用示例

#### 工具相关

```javascript
// API工具类
const api = require('../../utils/api.js');

// 获取工具列表
const getToolsByCategory = async (category = 0) => {
  try {
    const res = await api.getToolsByCategory(category);
    return res;
  } catch (error) {
    console.error('获取工具列表失败:', error);
    throw error;
  }
};

// 使用示例
getToolsByCategory(1).then(data => {
  console.log('实用软件:', data.data);
  console.log('数量:', data.count);
});
```

#### 图片上传

```javascript
// 选择并上传图片
chooseAndUploadImage() {
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      this.uploadImage(tempFilePath);
    }
  });
},

// 上传图片
uploadImage(filePath) {
  wx.showLoading({ title: '上传中...' });

  wx.uploadFile({
    url: 'http://127.0.0.1:8088/api/upload/image',
    filePath: filePath,
    name: 'image',
    success: (res) => {
      wx.hideLoading();
      const data = JSON.parse(res.data);
      
      if (data.code === 200) {
        wx.showToast({ title: '上传成功', icon: 'success' });
        this.setData({ imageUrl: data.data.url });
      } else {
        wx.showToast({ title: data.msg, icon: 'none' });
      }
    },
    fail: (err) => {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'none' });
      console.error('上传失败:', err);
    }
  });
}
```

### 3.5 数据库结构

#### tools表结构
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
  `category` tinyint(1) DEFAULT 0 COMMENT '分类: 0-全部/近期更新, 1-实用软件, 2-影视音乐, 3-万能资料',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具表';
```

### 3.6 文件存储

- **图片存储路径：** `Api/uploads/images/`
- **图片访问URL：** `http://127.0.0.1:8088/uploads/images/文件名`
- **文件命名规则：** 时间戳-随机数.扩展名

### 3.7 开发环境

- **Node.js版本：** 建议14.x及以上
- **数据库：** MySQL
- **进程管理：** PM2
- **依赖包：** express, mysql, cors, multer

### 3.8 部署说明

```bash
# 启动服务
pm2 start ecosystem.config.js

# 重启服务
pm2 restart api-server

# 查看状态
pm2 status

# 查看日志
pm2 logs api-server
```

---

**最后更新时间：** 2025-06-09
**版本：** v1.0.0 