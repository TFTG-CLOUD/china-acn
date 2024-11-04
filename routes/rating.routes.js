const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { validateParam, validateRequest } = require('../middlewares/validation.middleware');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { objectIdSchema, createRatingSchema, updateRatingSchema } = require('../schemas/rating.schema');

// 创建评分和评论
router.post('/', authenticateJWT, validateRequest(createRatingSchema), ratingController.createRating);

// 获取所有评分和评论
router.get('/', ratingController.getAllRatings);

// 获取单个评分和评论
router.get('/:id', validateParam(objectIdSchema), ratingController.getRatingById);

// 更新评分和评论
router.put('/:id', authenticateJWT, validateParam(objectIdSchema), validateRequest(updateRatingSchema), ratingController.updateRating);

// 删除评分和评论
router.delete('/:id', authenticateJWT, validateParam(objectIdSchema), ratingController.deleteRating);

module.exports = router;