-- 创建用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '用户昵称',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码(MD5加密)',
  `gender` tinyint(1) DEFAULT 0 COMMENT '性别 0-男 1-女',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像路径',
  `state` tinyint(1) DEFAULT 1 COMMENT '状态 0-冻结 1-正常',
  `token` text COMMENT 'JWT令牌',
  `role` varchar(20) DEFAULT 'user' COMMENT '角色 admin-管理员 user-普通用户',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入管理员账号（密码：admin123，MD5加密后的值）
INSERT INTO `users` (`name`, `username`, `password`, `gender`, `email`, `age`, `phone`, `avatar`, `state`, `role`) VALUES
('系统管理员', 'admin', '4fc4da9ea8c78dcf12af41a760c6935a', 0, 'admin@example.com', 30, '13800138000', '/images/default/boy.jpeg', 1, 'admin'),
('测试用户', 'testuser', '4fc4da9ea8c78dcf12af41a760c6935a', 1, 'test@example.com', 25, '13800138001', '/images/default/girl.jpeg', 1, 'user');

-- 创建管理员表（可选，用于更严格的后台管理）
CREATE TABLE IF NOT EXISTS `administrators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(50) NOT NULL COMMENT '管理员名称',
  `username` varchar(50) NOT NULL COMMENT '登录用户名',
  `password` varchar(255) NOT NULL COMMENT '密码(MD5加密)',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `role` varchar(20) DEFAULT 'admin' COMMENT '管理员角色',
  `permissions` text COMMENT '权限列表(JSON格式)',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
  `last_login_time` timestamp NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `token` text COMMENT 'JWT令牌',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 插入超级管理员
INSERT INTO `administrators` (`admin_name`, `username`, `password`, `email`, `phone`, `avatar`, `role`, `permissions`, `status`) VALUES
('超级管理员', 'superadmin', '4fc4da9ea8c78dcf12af41a760c6935a', 'super@admin.com', '13900139000', '/images/default/admin.jpeg', 'superadmin', '["all"]', 1),
('工具管理员', 'tooladmin', '4fc4da9ea8c78dcf12af41a760c6935a', 'tool@admin.com', '13900139001', '/images/default/admin.jpeg', 'admin', '["tools", "upload"]', 1); 