const cors = require('cors');
const corsConfig = require('../../config/cors');

module.exports = cors(corsConfig);
