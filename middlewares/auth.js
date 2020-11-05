const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET_DEV } = require('../utils/config');
const { needAuth, wrongToken } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization || authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.replace('Bearer ', '');
      try {
        req.user = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV); // записываем пейлоуд в объект запроса
      } catch (err) {
        throw new UnauthorizedError(wrongToken);
      }
    } catch (err) {
      throw new UnauthorizedError(needAuth);
    }

    next(); // пропускаем запрос дальше
  }
};
