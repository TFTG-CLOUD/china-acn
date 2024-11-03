// middlewares/error.middleware.js
const { ValidationError } = require('express-validation');
const mongoose = require('mongoose');

// 自定义错误类
class APIError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  let error = err;
  let statusCode = err.status || 500;
  let errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    error: {
      code: err.code || 'INTERNAL_ERROR',
      details: err.details || null
    }
  };

  // 开发环境下添加错误堆栈信息
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // 处理不同类型的错误
  if (err instanceof ValidationError) {
    // Express Validation 错误
    statusCode = 400;
    errorResponse.message = 'Validation Error';
    errorResponse.error = {
      code: 'VALIDATION_ERROR',
      details: err.details
    };
  } else if (err instanceof mongoose.Error.ValidationError) {
    // Mongoose 验证错误
    statusCode = 400;
    errorResponse.message = 'Data Validation Error';
    errorResponse.error = {
      code: 'MONGOOSE_VALIDATION_ERROR',
      details: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }))
    };
  } else if (err instanceof mongoose.Error.CastError) {
    // Mongoose 类型转换错误
    statusCode = 400;
    errorResponse.message = 'Invalid Data Format';
    errorResponse.error = {
      code: 'INVALID_DATA_FORMAT',
      details: {
        field: err.path,
        value: err.value,
        type: err.kind
      }
    };
  } else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    // MongoDB 错误
    if (err.code === 11000) {
      // 重复键错误
      statusCode = 409;
      errorResponse.message = 'Duplicate Entry';
      errorResponse.error = {
        code: 'DUPLICATE_ENTRY',
        details: {
          field: Object.keys(err.keyPattern)[0],
          value: Object.values(err.keyValue)[0]
        }
      };
    }
  } else if (err instanceof APIError) {
    // 自定义 API 错误
    statusCode = err.status;
    errorResponse.error.code = err.name;
    errorResponse.error.details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    // JWT 认证错误
    statusCode = 401;
    errorResponse.message = 'Unauthorized Access';
    errorResponse.error = {
      code: 'UNAUTHORIZED',
      details: err.message
    };
  }

  // 记录错误日志
  if (statusCode >= 500) {
    console.error('Server Error:', {
      timestamp: new Date().toISOString(),
      error: err,
      request: {
        method: req.method,
        url: req.url,
        body: req.body,
        headers: req.headers,
        ip: req.ip
      }
    });
  }

  // 发送错误响应
  res.status(statusCode).json(errorResponse);
};

// 404 错误处理中间件
const notFoundHandler = (req, res, next) => {
  const error = new APIError(404, 'Resource Not Found', {
    path: req.originalUrl,
    method: req.method
  });
  next(error);
};

// 异步错误包装器
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  APIError,
  errorHandler,
  notFoundHandler,
  asyncHandler
};