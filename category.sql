-- 创建工具分类表
CREATE TABLE IF NOT EXISTS `tool_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '分类名称',
  `sort_order` int(11) DEFAULT 0 COMMENT '排序顺序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具分类表';

-- 初始化默认分类数据
INSERT INTO `tool_categories` (`id`, `name`, `sort_order`, `status`) VALUES
(1, '全部/近期更新', 0, 1),
(2, '实用软件', 10, 1),
(3, '影视音乐', 20, 1),
(4, '漫画小说', 30, 1); 