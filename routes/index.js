const routes = require('express').Router();
const user = require('routes/user');

routes.use('/user', user);

module.exports = routes;