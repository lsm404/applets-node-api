# 服务器地址配置说明

## 问题描述
当前系统中的图片上传功能返回的是本地地址（127.0.0.1:8088），需要修改为公网地址以便正常访问。

## 解决方案

### 1. 后端API配置

已创建配置文件 `Api/config/server.js`，需要修改其中的生产环境配置：

```javascript
// 生产环境配置 - 请根据实际服务器地址修改
production: {
  port: 8088,
  host: '0.0.0.0',
  baseUrl: 'https://your-domain.com' // 请替换为您的实际域名
}
```

**修改步骤：**
1. 打开 `Api/config/server.js` 文件
2. 将 `https://your-domain.com` 替换为您的实际服务器域名
3. 重启API服务

### 2. 前端配置

前端上传组件位于 `applet-admin/src/views/tools/list.vue`，已配置为统一使用服务器地址：

```javascript
// 获取上传URL - 统一使用服务器地址，不区分本地和线上环境
const getUploadUrl = () => {
  // 统一使用服务器地址进行图片上传
  return 'http://120.46.28.146:9001/api/upload/image';
};
```

**特点：**
- 无论本地开发还是线上环境，都统一上传到服务器
- 避免了本地环境图片无法在线上访问的问题
- 简化了配置管理

### 3. 小程序端配置

小程序端的API配置位于 `app/utils/api.js`，已配置为服务器地址：

```javascript
// API配置
const API_BASE_URL = 'http://120.46.28.146:9001';
```

**注意：**
- 小程序端也统一使用服务器地址
- 确保服务器地址在小程序的合法域名列表中

### 4. 环境变量配置（推荐）

为了更好地管理不同环境的配置，建议使用环境变量：

**设置环境变量：**
```bash
# 生产环境
export NODE_ENV=production
export SERVER_BASE_URL=https://your-domain.com

# 启动服务
npm start
```

**在代码中使用：**
```javascript
const baseUrl = process.env.SERVER_BASE_URL || 'http://127.0.0.1:8088';
```

## 注意事项

1. **HTTPS配置**：如果使用HTTPS，确保SSL证书配置正确
2. **防火墙设置**：确保服务器端口（默认8088）对外开放
3. **域名解析**：确保域名正确解析到服务器IP
4. **跨域配置**：确保API服务已正确配置CORS

## 验证配置

配置完成后，可以通过以下方式验证：

1. **API测试**：
   ```bash
   curl https://your-domain.com/api/tools
   ```

2. **上传测试**：
   ```bash
   curl -X POST -F "image=@test.jpg" https://your-domain.com/api/upload/image
   ```

3. **前端测试**：在浏览器中访问管理后台，测试图片上传功能

## 常见问题

1. **图片无法显示**：检查返回的URL是否可以直接访问
2. **上传失败**：检查服务器磁盘空间和权限设置
3. **跨域错误**：检查CORS配置是否正确

配置完成后，所有上传的图片都将返回公网可访问的URL地址。 