// routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const { generateAuthResponse } = require('../utils/auth.utils');
const { asyncHandler } = require('../middlewares/error.middleware');
const router = express.Router();

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
  passport.authenticate('jwt', { session: false }),
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