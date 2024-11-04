const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const tagSchema = Joi.object({
  type: Joi.string().valid('GENRE', 'THEME', 'CHARACTER_TRAIT', 'CONTENT_WARNING', 'CUSTOM').default('GENRE'),
  slug: Joi.string().required().lowercase().trim(),
  translations: Joi.object().pattern(
    Joi.string().valid(...process.env.SUPPORTED_LANGUAGES.split(',')),
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required()
    })
  ).required(),
  icon: Joi.string().allow(null),
  color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  parentTag: JoiObjectId().optional(),
  isOfficial: Joi.boolean().default(false),
  usageCount: Joi.number().default(0),
  status: Joi.string().valid('ACTIVE', 'DEPRECATED', 'HIDDEN').default('ACTIVE')
});

module.exports = tagSchema;