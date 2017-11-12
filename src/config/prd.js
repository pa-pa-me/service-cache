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
        "levels": {
            "[all]": "ERROR"
        },
        messagePub: {
            host: 'service.hcdlearning.com'
        },
        appName: 'wechat-module'
        // ,"replaceConsole": true
    }
}