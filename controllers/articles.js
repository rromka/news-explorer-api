const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { notFound, forbidden } = require('../utils/constants');

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
        throw new NotFoundError(notFound);
      }
      if (`${article.owner}` === userId) {
        Article.findOneAndRemove(articleId)
          .then(() => res.send({ data: article }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbidden);
      }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  removeArticle,
};
