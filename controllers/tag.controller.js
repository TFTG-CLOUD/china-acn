const Tag = require('../models/tag.model');
const { APIError } = require('../middlewares/error.middleware');

// 创建标签
exports.createTag = async (req, res, next) => {
  try {
    const tagData = req.body;
    const tag = new Tag({ ...tagData, createdBy: req.user._id });
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};