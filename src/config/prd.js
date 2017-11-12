module.exports = {
    logger: {
        appName: 'wechat-module'
    },
    sso: {
        endpoint: "http://service.bridgeplus.cn:10086/token/parse"
    },
    cache: {
        host: "127.0.0.1",
        port: 6379
    },
    "logger": {
        appenders: { serviceCache: { type: 'file', filename: 'service-cache.log' } },
        categories: { default: { appenders: ['serviceCache'], level: 'error' } },
        appName: 'service-cache'
        // ,"replaceConsole": true
    }
}