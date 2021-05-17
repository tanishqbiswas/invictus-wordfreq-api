/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const words = require('./routes/words');
const logger = require('./logger');
require('dotenv').config();

const app = express();
global.logger = logger;

// register middlewares
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
  );
  res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', words);

app.listen(process.env.PORT, () => logger.info(`Server: WordFreq Api listening on port ${process.env.PORT}!`));
