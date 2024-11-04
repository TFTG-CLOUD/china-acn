const Media = require('../models/media.model');
const { APIError } = require('../middlewares/error.middleware');

// 创建媒体资源
exports.createMedia = async (req, res, next) => {
  try {
    const mediaData = req.body;
    mediaData.userId = req.user._id;
    mediaData.status = req.user.role === 'admin' ? 'reviewed' : 'pending';

    const media = new Media({ ...mediaData, userId: req.user._id });
    await media.save();

    res.status(201).json(media);
  } catch (error) {
    next(error);
  }
};

// 获取所有媒体资源
exports.getAllMedia = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, type = 'ANIME' } = req.query;
    const skip = (page - 1) * limit;
    const mediaList = await Media.find({ mediaType: type, status: 'approved' })
      .populate('characters')
      .populate('tags')
      .populate('userId', '_id useranme')
      .populate('assets')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));
    res.json(mediaList);
  } catch (error) {
    next(error);
  }
};

// 获取单个媒体资源
exports.getMediaById = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('characters')
      .populate('tags')
      .populate('userId', '_id useranme')
      .populate('assets');
    if (!media) {
      throw new APIError(404, 'Media not found');
    }
    res.json(media);
  } catch (error) {
    next(error);
  }
};

// 更新媒体资源
exports.updateMedia = async (req, res, next) => {
  try {
    const mediaData = req.body;
    const media = await Media.findById(req.params.id);

    if (!media) {
      throw new APIError(404, 'Media not found');
    }

    if (media.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new APIError(403, 'Unauthorized to update this media');
    }

    Object.assign(media, mediaData);
    await media.save();

    res.json(media);
  } catch (error) {
    next(error);
  }
};

// 删除媒体资源
exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      throw new APIError(404, 'Media not found');
    }

    if (media.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new APIError(403, 'Unauthorized to delete this media');
    }

    await media.remove();
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    next(error);
  }
};