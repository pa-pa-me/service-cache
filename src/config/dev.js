module.exports = {
    mock: {
        enabled: true,
        token: 'token_member_12345',
        member_id: '279d3ef4-8eef-48cf-bfb4-ba63d95f61d3'
    },
    sso: {
        endpoint: "http://uat.service.hcd.com:10086/token/parse"
    },
    cache: {
        host: "192.168.56.101",
        port: 6379
    },

    "logger": {
        appenders: { serviceCache: { type: 'file', filename: 'service-cache.log' } },
        categories: { default: { appenders: ['serviceCache'], level: 'error' } },
        appName: 'service-cache'
        // ,"replaceConsole": true
    }

}