const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

// 验证传递的id为Objectid
const objectIdSchema = Joi.object({
  id: JoiObjectId().required(),
});

// 查询验证 schema
const queryCharacterSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1)
});

// 创建角色的 schema
const createCharacterSchema = Joi.object({
  translations: Joi.object().pattern(Joi.string().valid(...process.env.SUPPORTED_LANGUAGES.split(',')), Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
  })).required(),
  tags: Joi.array().items(JoiObjectId()).required(),
  avatarUrl: Joi.string().uri().required(),
  mediaRefs: Joi.array().items(JoiObjectId()).required()
});

// 更新角色的 schema
const updateCharacterSchema = Joi.object({
  translations: Joi.object().pattern(Joi.string().valid(...process.env.SUPPORTED_LANGUAGES.split(',')), Joi.object({
    name: Joi.string(),
    description: Joi.string()
  })),
  tags: Joi.array().items(JoiObjectId()),
  avatarUrl: Joi.string().uri(),
  mediaRefs: Joi.array().items(JoiObjectId())
}).min(1); // 至少需要一个字段进行更新

module.exports = {
  createCharacterSchema,
  updateCharacterSchema,
  objectIdSchema,
  queryCharacterSchema
};