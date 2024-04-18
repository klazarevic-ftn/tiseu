const { auth } = require('express-openid-connect');
const authConfig = require('../../config/auth');

module.exports = auth(authConfig);
