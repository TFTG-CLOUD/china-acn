const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const { authenticateJWT, isAdmin } = require('../middlewares/auth.middleware');
const { uploadImage, uploadVideo } = require('../middlewares/upload.middleware');

// 上传图片资源
router.post('/image', authenticateJWT, uploadImage, assetController.uploadImage);

// 上传视频资源
router.post('/video', authenticateJWT, uploadVideo, assetController.uploadVideo);

module.exports = router;