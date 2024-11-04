const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);


// 验证传递的id为Objectid
const objectIdSchema = Joi.object({
  id: JoiObjectId().required(),
});


// 查询验证 schema
const queryMediaSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1),
  type: Joi.string().valid('ANIME', 'MANGA', 'NOVEL').default('ANIME')
});

// 创建媒体资源的 schema
const createMediaSchema = Joi.object({
  mediaType: Joi.string().valid('ANIME', 'MANGA', 'NOVEL').required(),
  translations: Joi.object().pattern(Joi.string().valid(...process.env.SUPPORTED_LANGUAGES.split(',')), Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
  })).required(),
  releaseDate: Joi.date().required(),
  duration: Joi.number().optional(),
  episodes: Joi.number().optional(),
  characters: Joi.array().items(JoiObjectId()).required(),
  tags: Joi.array().items(JoiObjectId()).required(),
  assets: Joi.array().items(JoiObjectId()).required()
});

// 更新媒体资源的 schema
const updateMediaSchema = Joi.object({
  mediaType: Joi.string().valid('ANIME', 'MANGA', 'NOVEL'),
  translations: Joi.object().pattern(Joi.string().valid(...process.env.SUPPORTED_LANGUAGES.split(',')), Joi.object({
    title: Joi.string(),
    description: Joi.string()
  })),
  releaseDate: Joi.date(),
  duration: Joi.number(),
  episodes: Joi.number(),
  characters: Joi.array().items(JoiObjectId()),
  tags: Joi.array().items(JoiObjectId()),
  assets: Joi.array().items(JoiObjectId())
}).min(1); // 至少需要一个字段进行更新

module.exports = {
  createMediaSchema,
  updateMediaSchema,
  objectIdSchema,
  queryMediaSchema
};