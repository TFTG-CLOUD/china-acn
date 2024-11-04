const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controller');
const { authenticateJWT, isAdmin } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const tagSchema = require('../schemas/tag.schema');

// 创建标签
router.post('/tags', authenticateJWT, validateRequest(tagSchema), tagController.createTag);

module.exports = router;