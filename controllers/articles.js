const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      if (!article) {
        throw new BadRequestError('Введены некорректные данные');
      }
      res.send(article);
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  Article.find({})
    .then((data) => res.status(200)
      .send(data))
    .catch(next);
};

const removeArticle = (req, res, next) => {
  const { articleId } = req.params;
  const { _id: userId } = req.user;
  Article.findById(articleId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Нет статьи с таким id');
      }
      if (`${article.owner}` === userId) {
        Article.findOneAndRemove(articleId)
          .then(() => res.send({ data: article }))
          .catch(next);
      } else {
        throw new ForbiddenError('Это не ваша статья');
      }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  removeArticle,
};
