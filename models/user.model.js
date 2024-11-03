// models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 验证密码方法
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 检查是否是管理员方法
userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);
// 初始化管理员账户
async function initializeAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn('Admin credentials not found in environment variables');
      return;
    }

    // 检查管理员是否已存在
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // 创建新管理员
      const admin = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true
      });

      await admin.save();
      console.log('Admin account created successfully');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error initializing admin account:', error);
  }
}

module.exports = {
  User,
  initializeAdmin
};