// middlewares/auth.middleware.js
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/user.model');
const { APIError } = require('./error.middleware');

// JWT策略配置
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

// 验证JWT token
const authenticateJWT = passport.authenticate('jwt', { session: false });

// 检查是否是管理员
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin()) {
      throw new APIError(403, 'Admin access required');
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateJWT,
  isAdmin
};