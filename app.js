require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

const { NODE_ENV, BASE_URL } = process.env;

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(limiter);
app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(3000, () => {});
