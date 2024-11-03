// config/database.js
const mongoose = require('mongoose');

const databaseConfig = {
  development: {
    uri: process.env.MONGODB_DEV_URI || 'mongodb://localhost:27017/your_db_dev',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  test: {
    uri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/your_db_test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10
    }
  },
  production: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // replicaSet: process.env.MONGODB_REPLICA_SET,
      // ssl: true,
      // authSource: 'admin'
    }
  }
};

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const env = process.env.NODE_ENV || 'development';
      const config = databaseConfig[env];

      if (this.connection) {
        return this.connection;
      }

      mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        process.exit(0);
      });

      this.connection = await mongoose.connect(config.uri, config.options);
      return this.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      this.connection = null;
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  // 健康检查
  async healthCheck() {
    try {
      if (mongoose.connection.readyState !== 1) {
        return {
          status: 'error',
          message: 'Database connection is not established'
        };
      }

      await mongoose.connection.db.admin().ping();
      return {
        status: 'ok',
        message: 'Database connection is healthy'
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

module.exports = new Database();