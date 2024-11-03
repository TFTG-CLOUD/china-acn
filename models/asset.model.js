// models/asset.model.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['IMAGE', 'VIDEO', 'AUDIO'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,  // 文件大小（字节）
    required: true
  },
  dimensions: {
    width: Number,
    height: Number
  },
  duration: Number,  // 视频/音频时长（秒）
  thumbnailUrl: String,  // 缩略图URL（用于视频）
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'READY', 'ERROR'],
    default: 'PENDING'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['CHARACTER', 'MEDIA'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  translations: {
    type: Map,
    of: {
      title: String,
      caption: String,
      altText: String
    }
  }
}, {
  timestamps: true
});

// 索引
assetSchema.index({ type: 1 });
assetSchema.index({ 'relatedTo.model': 1, 'relatedTo.id': 1 });
assetSchema.index({ uploadedBy: 1 });

// 虚拟属性：完整URL
assetSchema.virtual('fullUrl').get(function () {
  return process.env.ASSET_BASE_URL + this.url;
});

// 中间件：删除文件时的处理
assetSchema.pre('remove', async function (next) {
  try {
    // 这里可以添加删除实际文件的逻辑
    next();
  } catch (error) {
    next(error);
  }
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;