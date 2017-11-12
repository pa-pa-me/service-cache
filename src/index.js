import Koa from 'koa'
import logging from 'koa-logger'
import body_parser from 'koa-bodyparser'

import healthcheck from './common/healthcheck'
import Logger from './common/logger'
import config from './config'
import apply_extensions from './common/koa_extension'
import register_routers from './routers'

import * as cache from './common/cache'

const logger = new Logger('app.js')
cache.init(config.logger.appName, config.cache)

const app = module.exports = new Koa()
apply_extensions(app)

app.use(healthcheck())
app.use(logging())
app.use(body_parser())

register_routers(app)

app.on('error', err => logger.error(err));