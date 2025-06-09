const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/images');
    
    // 确保目录存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：时间戳 + 随机数 + 原始扩展名
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, filename);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只允许上传图片文件
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持上传 JPEG, PNG, GIF, WebP 格式的图片'), false);
  }
};

// 配置multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为5MB
  }
});

// 单文件上传接口
router.post('/upload/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        msg: '请选择要上传的图片文件'
      });
    }

    // 生成可访问的URL
    const imageUrl = `http://127.0.0.1:8088/uploads/images/${req.file.filename}`;
    
    res.json({
      code: 200,
      msg: '图片上传成功',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl,
        uploadTime: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({
      code: 500,
      msg: '图片上传失败: ' + error.message
    });
  }
});

// 多文件上传接口
router.post('/upload/images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        code: 400,
        msg: '请选择要上传的图片文件'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `http://127.0.0.1:8088/uploads/images/${file.filename}`,
      uploadTime: new Date().toISOString()
    }));
    
    res.json({
      code: 200,
      msg: '图片上传成功',
      count: uploadedFiles.length,
      data: uploadedFiles
    });
    
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({
      code: 500,
      msg: '图片上传失败: ' + error.message
    });
  }
});

// 删除图片接口
router.delete('/upload/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/images', filename);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        code: 404,
        msg: '文件不存在'
      });
    }
    
    // 删除文件
    fs.unlinkSync(filePath);
    
    res.json({
      code: 200,
      msg: '图片删除成功',
      data: {
        filename: filename
      }
    });
    
  } catch (error) {
    console.error('图片删除失败:', error);
    res.status(500).json({
      code: 500,
      msg: '图片删除失败: ' + error.message
    });
  }
});

// 获取图片信息接口
router.get('/upload/image/:filename/info', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/images', filename);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        code: 404,
        msg: '文件不存在'
      });
    }
    
    // 获取文件信息
    const stats = fs.statSync(filePath);
    
    res.json({
      code: 200,
      msg: '获取成功',
      data: {
        filename: filename,
        size: stats.size,
        url: `http://127.0.0.1:8088/uploads/images/${filename}`,
        createTime: stats.birthtime,
        modifyTime: stats.mtime
      }
    });
    
  } catch (error) {
    console.error('获取图片信息失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取图片信息失败: ' + error.message
    });
  }
});

module.exports = router; 