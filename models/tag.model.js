const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['GENRE', 'THEME', 'CHARACTER_TRAIT', 'CONTENT_WARNING', 'CUSTOM'],
    default: 'GENRE',
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  translations: {
    type: Map,
    of: {
      name: String,
      description: String
    }
  },
  icon: {
    type: String,  // 可以存储图标的名称或URL
    default: null
  },
  color: {
    type: String,  // 标签颜色（hex格式）
    default: '#000000'
  },
  parentTag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    default: null
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'DEPRECATED', 'HIDDEN'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

// 索引
tagSchema.index({ slug: 1 }, { unique: true });
tagSchema.index({ type: 1 });
tagSchema.index({ parentTag: 1 });
tagSchema.index({ 'translations.en.name': 'text', 'translations.zh.name': 'text' });

// 静态方法：根据语言获取标签名称
tagSchema.statics.getTagsByLanguage = async function (lang = 'en') {
  const tags = await this.find({ status: 'ACTIVE' });
  return tags.map(tag => ({
    id: tag._id,
    type: tag.type,
    slug: tag.slug,
    name: (tag.translations.get(lang) || tag.translations.get('en')).name,
    description: (tag.translations.get(lang) || tag.translations.get('en')).description,
    icon: tag.icon,
    color: tag.color
  }));
};

// 实例方法：获取完整的标签层次结构
tagSchema.methods.getHierarchy = async function () {
  const hierarchy = [this];
  let currentTag = this;

  while (currentTag.parentTag) {
    currentTag = await this.model('Tag').findById(currentTag.parentTag);
    if (currentTag) {
      hierarchy.unshift(currentTag);
    } else {
      break;
    }
  }

  return hierarchy;
};

// 中间件：更新使用计数
tagSchema.pre('save', async function (next) {
  if (this.isNew) {
    // 如果有父标签，增加父标签的使用计数
    if (this.parentTag) {
      await this.model('Tag').findByIdAndUpdate(
        this.parentTag,
        { $inc: { usageCount: 1 } }
      );
    }
  }
  next();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;