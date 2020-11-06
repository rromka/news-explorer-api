const articles = require('express').Router();
const {
  validateCreateArticle,
  validateGetArticles,
  validateRemoveArticle,
} = require('../middlewares/requestValidation');
const {
  getArticles, createArticle, removeArticle,
} = require('../controllers/articles');

articles.get('/', validateGetArticles, getArticles);

articles.post('/', validateCreateArticle, createArticle);

articles.delete('/:articleId', validateRemoveArticle, removeArticle);

module.exports = articles;
