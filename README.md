# WeChat Mini-Program API Server

微信小程序API服务端，提供工具管理和图片上传功能。

## 快速开始

### 安装依赖
```bash
npm install
```

### 配置数据库
1. 修改 `dbconfig.js` 中的数据库连接信息
2. 导入 `tools.sql` 初始化数据表

### 启动服务
```bash
# 开发模式
npm start

# 生产模式（PM2）
pm2 start ecosystem.config.js
```

### 访问地址
- API服务：http://127.0.0.1:8088
- 图片访问：http://127.0.0.1:8088/uploads/images/

## 文档

📚 **[完整API文档](./API-Documentation.md)**

包含所有接口的详细说明、请求参数、响应格式和使用示例。

## 主要功能

- ✅ 工具管理（增删改查）
- ✅ 分类筛选（4个分类：近期更新、实用软件、影视音乐、万能资料）
- ✅ 图片上传（单文件/多文件）
- ✅ 图片管理（删除、信息查询）
- ✅ PM2进程管理
- ✅ 跨域支持
- ✅ 错误处理

## 技术栈

- **后端框架：** Express.js
- **数据库：** MySQL
- **文件上传：** Multer
- **进程管理：** PM2
- **跨域处理：** CORS

## 项目结构
```
Api/
├── system/           # 系统模块
│   ├── tools.js     # 工具管理接口
│   └── upload.js    # 图片上传接口
├── uploads/         # 文件存储目录
├── logs/           # 日志文件
├── index.js        # 主入口文件
├── router.js       # 路由配置
├── dbconfig.js     # 数据库配置
├── tools.sql       # 数据表结构
└── ecosystem.config.js  # PM2配置
```

## 开发指南

1. 所有接口遵循RESTful设计规范
2. 统一的响应格式：`{code, msg, data}`
3. 参数化查询防止SQL注入
4. 软删除机制保护数据安全
5. 文件上传安全检查（类型、大小限制）

---

**最后更新：** 2025-06-09  
**版本：** v1.0.0 