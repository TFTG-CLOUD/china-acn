// services/user.service.js
const { User } = require('../models/user.model');
const { APIError } = require('../middlewares/error.middleware');
const { generateAuthResponse } = require('../utils/auth');
const bcrypt = require('bcryptjs');

class UserService {
  // 注册
  async register(userData) {
    const { email, password } = userData;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new APIError(400, 'Email already exists');
    }

    // 创建新用户
    const user = new User({
      email: email.toLowerCase(),
      password,
      isVerified: false
    });

    await user.save();
    return generateAuthResponse(user);
  }

  // 登录
  async login(email, password) {
    // 查找用户
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new APIError(401, 'Invalid credentials');
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new APIError(401, 'Invalid credentials');
    }

    return generateAuthResponse(user);
  }

  // 修改密码
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new APIError(404, 'User not found');
    }

    // 验证当前密码
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new APIError(401, 'Current password is incorrect');
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  // 重置密码请求
  async requestPasswordReset(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new APIError(404, 'User not found');
    }

    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1小时后过期

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // TODO: 发送重置密码邮件
    return { message: 'Password reset email sent' };
  }

  // 重置密码
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      throw new APIError(400, 'Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return { message: 'Password has been reset successfully' };
  }
}

module.exports = new UserService();