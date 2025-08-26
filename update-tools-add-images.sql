-- 为tools表添加images字段，用于存储轮播图片
ALTER TABLE `tools` ADD COLUMN `images` JSON DEFAULT NULL COMMENT '轮播图片JSON数组' AFTER `iconPath`;

-- 更新现有数据的示例（如果有需要的话）
-- UPDATE `tools` SET `images` = JSON_ARRAY() WHERE `images` IS NULL;
