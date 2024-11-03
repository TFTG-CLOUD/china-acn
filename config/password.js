// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/user.model');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
},
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // 查找或创建用户
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // 检查邮箱是否已被使用
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // 如果邮箱已存在但没有关联Google账号，则关联
          existingUser.googleId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        // 创建新用户
        user = new User({
          email: profile.emails[0].value,
          googleId: profile.id,
          isVerified: true, // Google账号默认已验证
          password: Math.random().toString(36).slice(-8), // 生成随机密码
        });
        await user.save();
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

module.exports = passport;