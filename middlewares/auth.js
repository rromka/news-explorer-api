const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.replace('Bearer ', '');
      try {
        const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
        req.user = payload; // записываем пейлоуд в объект запроса
      } catch (err) {
        throw new UnauthorizedError('Неверный токен');
      }
    } catch (err) {
      throw new ForbiddenError('Необходима авторизация');
    }

    next(); // пропускаем запрос дальше
  }
};
