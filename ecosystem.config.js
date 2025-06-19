/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-06-09 10:48:01
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-19 14:30:44
 * @FilePath: /applet/Api/ecosystem.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  apps: [{
    name: 'api-server',
    script: 'index.js',
    // cwd: '/home/Api',
    cwd: '/Users/lishengmin/WeChatProjects/applet/Api',
    instances: 1,
    autorestart: true,
    watch: true,              // 启用监听
    ignore_watch: [           // 忽略的目录
      "node_modules",
      "logs"
    ],
    watch_delay: 1000,        // 变化检测延迟（毫秒）
    autorestart: true,        // 文件变化时自动重启
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 8088
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8088
    },
    error_file: './logs/api-error.log',
    out_file: './logs/api-out.log',
    log_file: './logs/api-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
} 