-- 创建工具表
CREATE TABLE IF NOT EXISTS `tools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '工具名称',
  `size` varchar(50) DEFAULT NULL COMMENT '文件大小',
  `desc` text COMMENT '工具描述',
  `version` varchar(100) DEFAULT NULL COMMENT '版本号',
  `iconClass` varchar(100) DEFAULT NULL COMMENT '图标类名',
  `iconPath` text COMMENT '图标路径',
  `link` text COMMENT '下载链接',
  `category` tinyint(1) DEFAULT 0 COMMENT '分类: 0-全部/近期更新, 1-实用软件, 2-影视音乐, 3-漫画小说',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具表';

-- 插入示例数据（ID自动生成，包含分类）
INSERT INTO `tools` (`title`, `size`, `desc`, `version`, `iconClass`, `iconPath`, `link`, `category`, `status`) VALUES
('针孔摄像头探测', '38MB', '针孔摄像头探测会员版', '会员版', 'camera', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 1, 1),
('微聊天记录精灵', '106MB', '微信聊天记录精灵', '官方版', 'wechat', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 1, 1),
('天道音乐免费版', '20MB', '音乐神器，无损下载', 'v1.5.7', 'music', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 2, 1),
('唐诗宋词学习', '6.8MB', '学诗词必备', '最新版', 'poem', 'https://bkimg.cdn.bcebos.com/pic/cb8065380cd791235f3c35afa3345982b3b78009?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,w_277', 'https://pan.quark.cn/s/29114aa7c407', 3, 1); 