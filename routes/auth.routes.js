// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const { generateAuthResponse } = require('../utils/auth.utils');
const { asyncHandler } = require('../middlewares/error.middleware');
const router = express.Router();
const userService = require('../services/auth.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema
} = require('../schemas/user.schema');

// 注册
router.post('/register',
  validateRequest(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await userService.register(req.body);
    res.status(201).json(result);
  })
);

// 登录
router.post('/login',
  validateRequest(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  })
);

// 修改密码
router.post('/change-password',
  authenticateJWT,
  validateRequest(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );
    res.json(result);
  })
);

// 请求重置密码
router.post('/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await userService.requestPasswordReset(email);
    res.json(result);
  })
);

// 重置密码
router.post('/reset-password',
  validateRequest(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await userService.resetPassword(token, newPassword);
    res.json(result);
  })
);

// Google登录初始化
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Google登录回调
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  asyncHandler(async (req, res) => {
    const authResponse = generateAuthResponse(req.user);

    // 重定向到前端并携带token
    // 实际项目中应该重定向到前端页面，并通过URL参数或其他方式传递token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${authResponse.token}`);
  })
);

// 获取当前用户信息
router.get('/me',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified
      }
    });
  })
);

module.exports = router;