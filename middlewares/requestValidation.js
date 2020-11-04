const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

// Валидация запросов к пользователям
const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    id: Joi.string().hex().length(24),
  }).unknown(true),
});

const validateUserReg = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
});

const validateGetUserInfo = celebrate({
  body: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).unknown(true),
});

// Валидация запросов к статьям

const validateGetArticles = celebrate({
  body: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).unknown(true),
});

const validateCreateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) return helpers.error('Невалидная ссылка');
      return value;
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (!isURL(value)) return helpers.error('Невалидная ссылка');
      return value;
    }),
  }).unknown(true),
});

const validateRemoveArticle = celebrate({
  body: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }).unknown(true),
});

module.exports = {
  validateUser,
  validateUserReg,
  validateGetUserInfo,
  validateCreateArticle,
  validateGetArticles,
  validateRemoveArticle,
};
