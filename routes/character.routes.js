const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character.controller');
const { validateParam, validateRequest, validateQuery } = require('../middlewares/validation.middleware');
const { authenticateJWT, isAdmin } = require('../middlewares/auth.middleware');
const { objectIdSchema, createCharacterSchema, queryCharacterSchema, updateCharacterSchema } = require('../schemas/character.schema');

// 创建角色
router.post('/', authenticateJWT, validateRequest(createCharacterSchema), characterController.createCharacter);

// 获取所有角色
router.get('/', validateQuery(queryCharacterSchema), characterController.getAllCharacters);

// 获取单个角色
router.get('/:id', validateParam(objectIdSchema), characterController.getCharacterById);

// 更新角色
router.put('/:id', authenticateJWT, isAdmin, validateParam(objectIdSchema), validateRequest(updateCharacterSchema), characterController.updateCharacter);

// 删除角色
router.delete('/:id', authenticateJWT, isAdmin, validateParam(objectIdSchema), characterController.deleteCharacter);

module.exports = router;