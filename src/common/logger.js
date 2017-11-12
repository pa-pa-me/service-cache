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
            Object.keys(appenders).forEach(function (a) {
                appenders[a].appName = tmpConfig.appName;
            });
        }
    }

    log4js.configure(tmpConfig);
};

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
