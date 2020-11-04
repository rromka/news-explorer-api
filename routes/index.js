const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const { validateUser, validateUserReg } = require('../middlewares/requestValidation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { auth } = require('../middlewares/auth');

router.post('/signin', validateUser, login);
router.post('/signup', validateUserReg, createUser);

router.use(auth);
router.use('/articles', articles);
router.use('/users', users);

router.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
