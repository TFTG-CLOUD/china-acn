const Rating = require('../models/rating.model');
const { APIError } = require('../middlewares/error.middleware');

// 创建评分和评论
exports.createRating = async (req, res, next) => {
  try {
    const ratingData = req.body;
    ratingData.userId = req.user._id;

    const rating = new Rating(ratingData);
    await rating.save();

    res.status(201).json(rating);
  } catch (error) {
    next(error);
  }
};

// 获取所有评分和评论
exports.getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find()
      .populate('userId', '_id username')
      .populate('mediaId', '_id title');
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

// 获取单个评分和评论
exports.getRatingById = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('userId', '_id username')
      .populate('mediaId', '_id title');
    if (!rating) {
      throw new APIError(404, 'Rating not found');
    }
    res.json(rating);
  } catch (error) {
    next(error);
  }
};

// 更新评分和评论
exports.updateRating = async (req, res, next) => {
  try {
    const ratingData = req.body;
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      throw new APIError(404, 'Rating not found');
    }

    if (rating.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Unauthorized to update this rating');
    }

    Object.assign(rating, ratingData);
    await rating.save();

    res.json(rating);
  } catch (error) {
    next(error);
  }
};

// 删除评分和评论
exports.deleteRating = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      throw new APIError(404, 'Rating not found');
    }

    if (rating.userId.toString() !== req.user._id.toString()) {
      throw new APIError(403, 'Unauthorized to delete this rating');
    }

    await rating.remove();
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    next(error);
  }
};