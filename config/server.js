/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-06-12 10:32:21
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-12 15:09:02
 * @FilePath: /applet/Api/config/server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 服务器配置
const config = {
  // 开发环境配置 - 统一使用线上图片地址
  development: {
    port: 8088,
    host: '0.0.0.0',
    baseUrl: 'http://120.46.28.146:8088' // 开发环境也使用线上地址，统一图片存储
  },
  
  // 生产环境配置 - 请根据实际服务器地址修改
  production: {
    port: 8088,
    host: '0.0.0.0',
    baseUrl: 'http://120.46.28.146:8088' // 生产环境使用公网地址和对应端口
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