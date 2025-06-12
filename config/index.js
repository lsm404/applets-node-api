/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-06-12 15:56:33
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-12 17:04:29
 * @FilePath: /applet/Api/config/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 统一配置管理
 * 解决配置分散、环境切换混乱的问题
 */

// 获取环境变量
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8088;

// 基础配置
const baseConfig = {
  port: PORT,
  host: '0.0.0.0',
  jwtSecret: 'moyc^-^',
  
  // 数据库配置
  database: {
    host: '120.46.28.146',
    user: 'db',
    password: 'admin123',
    database: 'db',
    timezone: "SYSTEM"
  },
  
  // 文件上传配置
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    path: './uploads/images'
  }
};

// 环境特定配置
const envConfigs = {
  development: {
    ...baseConfig,
    baseUrl: 'http://120.46.28.146:9001', // 生产环境用线上
    corsOrigin: ['http://120.46.28.146:9001'], // 生产前端地址
    debug: false
  },
  
  production: {
    ...baseConfig,
    baseUrl: 'http://120.46.28.146:8088', // 生产环境用线上
    corsOrigin: ['http://120.46.28.146:8001'], // 生产前端地址
    debug: false
  }
};

// 当前配置
const config = envConfigs[NODE_ENV];

// 工具方法
const utils = {
  // 获取文件访问URL
  getFileUrl: (filename) => {
    return `${config.baseUrl}/uploads/images/${filename}`;
  },
  
  // 获取API基础URL
  getApiBaseUrl: () => {
    return `${config.baseUrl}/api`;
  },
  
  // 判断是否为开发环境
  isDev: () => NODE_ENV === 'development',
  
  // 判断是否为生产环境
  isProd: () => NODE_ENV === 'production'
};

module.exports = {
  ...config,
  utils,
  NODE_ENV
}; 