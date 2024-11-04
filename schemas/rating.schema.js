const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

// 验证传递的id为Objectid
const objectIdSchema = Joi.object({
  id: JoiObjectId().required(),
});

// 创建评分和评论的 schema
const createRatingSchema = Joi.object({
  userId: JoiObjectId().required(),
  mediaId: JoiObjectId().required(),
  score: Joi.number().min(0).max(10).required(),
  translations: Joi.object().pattern(Joi.string().valid(...process.env.SUPPORTED_LANGUAGES.split(',')), Joi.object({
    comment: Joi.string().required()
  })).required()
});

// 更新评分和评论的 schema
const updateRatingSchema = Joi.object({
  score: Joi.number().min(0).max(10),
  translations: Joi.object().pattern(Joi.string().valid(...process.env.SUPPORTED_LANGUAGES.split(',')), Joi.object({
    comment: Joi.string()
  }))
}).min(1); // 至少需要一个字段进行更新

module.exports = {
  createRatingSchema,
  updateRatingSchema,
  objectIdSchema
};