// app.js
const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const meilisearch = require('./config/meilisearch');
const { initializeAdmin } = require('./models/user.model');
const passport = require('./config/passport');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
require('dotenv').config();

async function initializeServices() {
  try {
    // 连接数据库
    await database.connect();

    // 初始化管理员账户
    await initializeAdmin();

    // 初始化 MeiliSearch
    await meilisearch.initialize();

    // 应用其他初始化...
  } catch (error) {
    console.error('Service initialization error:', error);
    process.exit(1);
  }
}

const app = express();
// 数据库连接
await initializeServices();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// 路由
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/characters', require('./routes/character.routes'));
app.use('/api/media', require('./routes/media.routes'));
app.use('/api/ratings', require('./routes/rating.routes'));
app.use('/api/tags', require('./routes/tag.routes'));

// 错误处理中间件
// 404 处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});