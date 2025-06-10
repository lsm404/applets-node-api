module.exports = {
  apps: [{
    name: 'api-server',
    script: 'index.js',
    cwd: '/home/Api',
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