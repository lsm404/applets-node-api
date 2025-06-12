/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-06-12 10:32:21
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-12 11:14:10
 * @FilePath: /applet/Api/config/server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 服务器配置
const config = {
  // 开发环境配置
  development: {
    port: 9001,
    host: '0.0.0.0',
    baseUrl: 'https://120.46.28.146:9000' // 使用https协议，默认端口
  },
  
  // 生产环境配置 - 请根据实际服务器地址修改
  production: {
    port: 9001,
    host: '0.0.0.0',
    baseUrl: 'https://120.46.28.146' // 生产环境使用相同的公网地址
  }
};

// 根据环境变量选择配置
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

module.exports = {
  ...currentConfig,
  // 获取完整的文件访问URL
  getFileUrl: (relativePath) => {
    return `${currentConfig.baseUrl}${relativePath}`;
  },
  
  // 获取上传文件的完整URL
  getUploadUrl: (filename) => {
    return `${currentConfig.baseUrl}/uploads/images/${filename}`;
  }
}; 