const env = process.env.NODE_ENV || 'dev'

const config = require('./' + env);
config.wechat = require('./wechat');
module.exports = config;