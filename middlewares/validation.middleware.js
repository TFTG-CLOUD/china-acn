// middlewares/validation.middleware.js
const { schema } = require('../models/tag.model');
const { APIError } = require('./error.middleware');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new APIError(400, error.details[0].message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.query);
      if (error) {
        throw new APIError(400, error.details[0].message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

const validateParam = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.params);
      if (error) {
        throw new APIError(400, error.details[0].message);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  validateRequest,
  validateParam,
  validateQuery
};