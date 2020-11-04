const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  return bcrypt.hash(password, 10, (error, hash) => User.findOne({ email })
    .then((user) => {
      if (user) return next(new ConflictError('Пользователь с таким email уже есть'));

      return User.create({
        email,
        password: hash,
        name,
      })
        .then(() => res.status(200).send({ message: `Пользователь ${email} успешно создан!` }))
        .catch(() => new BadRequestError('Ошибка в запросе'));
    })
    .catch(next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Нет пользователя с таким email');

      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) return new UnauthorizedError('Пароль не верный');

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
          { expiresIn: '7d' },
        );
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.status(200)
      .send(user))
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUserInfo,
};
