const routes = require('express').Router();
const user = require('routes/user');
const search = require('routes/search');

routes.use('/user', user);
routes.use('/search', search);

module.exports = routes;