const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET_DEV } = require('../utils/config');
const { needAuth, wrongToken } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(needAuth));
  }
  const token = authorization.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    next(new UnauthorizedError(wrongToken));
  }
  next(); // пропускаем запрос дальше
};
