const express = require('express');
const app = express();
const routes = require('../app/routes');
const cors = require('cors');

app.use(cors({
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  origin: '*'
}));

routes(app);

module.exports = app;
