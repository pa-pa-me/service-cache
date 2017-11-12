import Router from 'koa-router'
import Logger from '../common/logger'
import request from 'co-request';
import config from '../config';
import util from 'util';
import * as cache from '../common/cache';
import crypto from 'crypto';

const logger = new Logger('wechat.js')
const router = new Router()

/**
 *
 * @param accessToken
 * @returns {Promise.<void>}
 *      {
errcode: 0,
errmsg: "ok",
ticket: "kgt8ON7yVITDhtdwci0qee9EWIkQlIm9XxxXfJc8r7OhZbQfUnZgVMFXrw6ttvv9sfs_9kyHtMs49bAORiIE2Q",
expires_in: 7200
}
 */
async function getJsTicketResultByAccessToken(accessToken) {
    let result = await request.get(config.wechat.jsTicket.url.replace('ACCESS_TOKEN', accessToken));

    if (result && result.body) {
        return parseJson(result.body);
    }

    throw new Error(JSON.stringify(result));
}

/**
 *
 * @param appId
 * @param appSecret
 * @returns {Promise.<void>}
 *      {
access_token: "MA9j3oXfWAuvvfJhyYtctFYY3NFGtkprg9_zuN0UDjRQYql8i9OA1UpDxvu4RC0sh1rMoHNx3UdPlXzaRLT9W9AsBKVTeabAFABngBxIIswCvfdaEN37-24Lzx6YBCyZGKBgAFARVM",
expires_in: 7200
}
 */
async function getAccessToken(appId, appSecret) {
    let key = util.format(config.wechat.accessToken.cache.key, appId);

    let accessToken = await cache.get(key);

    if (!accessToken) {
        let result = await request.get(config.wechat.accessToken.url.replace('APPID', appId).replace('APPSECRET', appSecret));

        if (!result || !result.body) {
            throw new Error(JSON.stringify(result));
        }

        let accessTokenResult = parseJson(result.body);
        accessToken = accessTokenResult.access_token;

        cache.set(key, accessToken, Math.min(config.wechat.accessToken.cache.expire, accessTokenResult.expires_in));
    }

    return accessToken;
}

async function getJsTicket(appId, appSecret) {
    let accessToken = await getAccessToken(appId, appSecret);

    let key = util.format(config.wechat.jsTicket.cache.key, appId);

    let jsTicket = await cache.get(key);
    if (!jsTicket) {
        let jsTicketResult = await getJsTicketResultByAccessToken(accessToken);

        jsTicket = jsTicketResult.ticket;
        cache.set(key, jsTicket, Math.min(config.wechat.jsTicket.cache.expire, jsTicketResult.expires_in));
    }

    return jsTicket;
}

function parseJson(result) {
    console.log('parsing ', result);
    if (result && (typeof result !== 'object')) {
        return JSON.parse(result);
    }

    return result;
}

router.get('/js-ticket/:app?'
    , async ctx => {
        try {
            let app = ctx.get_param('app');
            ctx.body = await getJsTicket(config.wechat.accounts[app].appid, config.wechat.accounts[app].secret);
        } catch (ex) {
            logger.error(ex);
            throw ex;
        }
    });

function sortSignableData(data) {
    let keys = Object.keys(data);
    keys.sort();

    let signSortedData = {};
    keys.forEach(function (p) {
        if (p === 'sign') {
            return;
        }

        if (data[p] === undefined) {
            return;
        }

        signSortedData[p] = data[p];
    });

    signSortedData.sign = data.sign;

    return signSortedData;
}

function stringify(data) {
    let keys = Object.keys(data);
    let s = [];
    keys.forEach(function (p) {
        if (p === 'sign') {
            return;
        }
        s.push(p.toLowerCase() + '=' + data[p]);
    });

    return s.join('&');
}

function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}

function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}

async function sign(app, url) {
    let jsTicket = await
        getJsTicket(config.wechat.accounts[app].appid, config.wechat.accounts[app].secret);
    let signable = {
        jsapi_ticket: jsTicket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: decodeURIComponent(url)
    };
    signable = sortSignableData(signable);
    let raw = stringify(signable);
    let sha1 = crypto.createHash('sha1');
    sha1.update(raw);
    let digest = sha1.digest('hex');
    signable.signature = digest;
    signable.appId = config.wechat.accounts[app].appid;
    return signable;
}

router.get('/sign/:app', async ctx => {
    try {
        ctx.body = await sign(ctx.params.app, ctx.query.url);
    } catch (ex) {
        logger.error(ex);
        throw ex;
    }
});


export default function register(app) {
    app.use(router.routes())
    app.use(router.allowedMethods());
}

