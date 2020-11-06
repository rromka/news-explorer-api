const users = require('express').Router();
const { validateGetUserInfo } = require('../middlewares/requestValidation');
const { getUserInfo } = require('../controllers/users');

users.get('/me', validateGetUserInfo, getUserInfo);

module.exports = users;
