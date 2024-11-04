const Character = require('../models/character.model');
const { APIError } = require('../middlewares/error.middleware');

// 创建角色
exports.createCharacter = async (req, res, next) => {
  try {
    const characterData = req.body;
    characterData.userId = req.user._id;

    const character = new Character(characterData);
    await character.save();

    res.status(201).json(character);
  } catch (error) {
    next(error);
  }
};

// 获取所有角色
exports.getAllCharacters = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const characters = await Character.find()
      .populate('tags')
      .populate('userId', '_id username')
      .populate('mediaRefs')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));
    res.json(characters);
  } catch (error) {
    next(error);
  }
};

// 获取单个角色
exports.getCharacterById = async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id)
      .populate('tags')
      .populate('userId', '_id username')
      .populate('mediaRefs');
    if (!character) {
      throw new APIError(404, 'Character not found');
    }
    res.json(character);
  } catch (error) {
    next(error);
  }
};

// 更新角色
exports.updateCharacter = async (req, res, next) => {
  try {
    const characterData = req.body;
    const character = await Character.findById(req.params.id);

    if (!character) {
      throw new APIError(404, 'Character not found');
    }

    if (character.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new APIError(403, 'Unauthorized to update this character');
    }

    Object.assign(character, characterData);
    await character.save();

    res.json(character);
  } catch (error) {
    next(error);
  }
};

// 删除角色
exports.deleteCharacter = async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      throw new APIError(404, 'Character not found');
    }

    if (character.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new APIError(403, 'Unauthorized to delete this character');
    }

    await character.remove();
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    next(error);
  }
};