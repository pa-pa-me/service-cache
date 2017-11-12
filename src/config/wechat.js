module.exports = {
    accessToken: {
        url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET",
        cache: {
            key: "WechatTokenService_AccessToken_%s",
            expire: 7100
        }
    },
    jsTicket: {
        url: "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi",
        cache: {
            key: "WechatTokenService_JsTicket_%s",
            expire: 7100
        }
    },
    accounts: {
        buzz: {
            "appid": process.env.buzz_wechat_appid,
            "secret": process.env.buzz_wechat_secret
        }
    }
};