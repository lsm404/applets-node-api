// 统一图片服务配置
// 无论开发环境还是生产环境，都使用同一个线上服务器存储图片
const UNIFIED_CONFIG = {
  // 图片服务器配置（统一使用线上服务器）
  imageServer: {
    host: 'http://120.46.28.146:8088',
    uploadPath: '/api/upload/image',
    staticPath: '/uploads/images'
  },
  
  // 根据当前环境决定其他API服务
  getApiConfig: () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return {
      // API服务配置
      api: {
        host: isDevelopment ? 'http://127.0.0.1:8088' : 'https://120.46.28.146:8088',
        port: 8088
      },
      
      // 图片服务配置（统一）
      image: {
        uploadUrl: `${UNIFIED_CONFIG.imageServer.host}${UNIFIED_CONFIG.imageServer.uploadPath}`,
        getImageUrl: (filename) => `${UNIFIED_CONFIG.imageServer.host}${UNIFIED_CONFIG.imageServer.staticPath}/${filename}`,
        baseUrl: UNIFIED_CONFIG.imageServer.host
      }
    };
  }
};

module.exports = UNIFIED_CONFIG; 