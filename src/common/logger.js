var log4js = require('log4js');
var config = require('../config');
var logName;

function Logger(name) {
    name = name || '';
    var log = log4js.getLogger(logName);

    return {
        fatal: function () {
            var args = Array.prototype.slice.call(arguments);
            args.push('logname: ' + name);
            log.fatal.apply(log, args);
        },
        error: function () {
            var args = Array.prototype.slice.call(arguments);
            args.push('logname: ' + name);
            log.error.apply(log, args);
        },
        warn: function () {
            var args = Array.prototype.slice.call(arguments);
            args.push('logname: ' + name);
            log.warn.apply(log, args);
        },
        info: function () {
            var args = Array.prototype.slice.call(arguments);
            args.push('logname: ' + name);
            log.info.apply(log, args);
        },
        debug: function () {
            var args = Array.prototype.slice.call(arguments);
            args.push('logname: ' + name);
            log.debug.apply(log, args);
        },
        trace: function () {
            var args = Array.prototype.slice.call(arguments);
            args.push('logname: ' + name);
            log.trace.apply(log, args);
        }
    };
}

Logger.setName = function (name) {
    logName = name;
};

Logger.init = function (param) {
    var tmpConfig = {};
    tmpConfig = Object.assign(tmpConfig, config.logger);

    if (param) {
        tmpConfig = Object.assign(tmpConfig, param)

        var appenders = tmpConfig.appenders;
        if (appenders) {
            appenders.forEach(function (a) {
                a.appName = tmpConfig.appName;
            });
        }
    }

    log4js.configure(tmpConfig);

    if (tmpConfig.messagePub) {
        tmpConfig.messagePub.appName = tmpConfig.appName;

        var pubAppender = require('./appender/kafkaPub');
        log4js.loadAppender('messagePub', pubAppender);
        log4js.addAppender(pubAppender.appender(tmpConfig.messagePub));
    }
    if (tmpConfig.plugin_appenders) {
        for (var i in tmpConfig.plugin_appenders) {
            var appenderConfig = tmpConfig.plugin_appenders[i];

            if (!appenderConfig.config) {
                appenderConfig.config = {};
            }
            appenderConfig.config.appName = tmpConfig.appName;

            var func = appenderConfig.appender;
            log4js.loadAppender(appenderConfig.type, func);
            log4js.addAppender(func.appender(appenderConfig.config));
        }
    }

}

Logger.express = function (level) {
    return log4js.connectLogger(log4js.getLogger(logName),
        {level: level});
};

Logger.log4js = log4js;
Logger.layouts = log4js.layouts;

function init(config) {
    if (!config) {
        return
    }

    Logger.init(config.logger)
}

init(config)

export default Logger
