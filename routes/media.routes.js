const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const { validateParam, validateRequest, validateQuery } = require('../middlewares/validation.middleware');
const { authenticateJWT, isAdmin } = require('../middlewares/auth.middleware');
const { objectIdSchema, createMediaSchema, queryMediaSchema, updateMediaSchema } = require('../schemas/media.schema');

// 创建媒体资源
router.post('/', authenticateJWT, validateRequest(createMediaSchema), mediaController.createMedia);

// 获取所有媒体资源
router.get('/', validateQuery(queryMediaSchema), mediaController.getAllMedia);

// 获取单个媒体资源
router.get('/:id', validateParam(objectIdSchema), mediaController.getMediaById);

// 更新媒体资源
router.put('/:id', authenticateJWT, isAdmin, validateParam(objectIdSchema), validateRequest(updateMediaSchema), mediaController.updateMedia);

// 删除媒体资源
router.delete('/:id', authenticateJWT, isAdmin, validateParam(objectIdSchema), mediaController.deleteMedia);

module.exports = router;