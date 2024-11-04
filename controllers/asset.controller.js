const Asset = require('../models/asset.model');
const { APIError } = require('../middlewares/error.middleware');

// 上传图片资源
exports.uploadImage = async (req, res, next) => {
  try {
    const imageData = req.file;
    const asset = new Asset({
      type: 'IMAGE',
      url: imageData.path,
      filename: imageData.filename,
      mimeType: imageData.mimetype,
      size: imageData.size,
      dimensions: {
        width: imageData.width,
        height: imageData.height
      },
      status: 'READY',
      uploadedBy: req.user._id
    });
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

// 上传视频资源
exports.uploadVideo = async (req, res, next) => {
  try {
    const videoData = req.file;
    const asset = new Asset({
      type: 'VIDEO',
      url: videoData.path,
      filename: videoData.filename,
      mimeType: videoData.mimetype,
      size: videoData.size,
      duration: videoData.duration,
      uploadedBy: req.user._id
    });
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};