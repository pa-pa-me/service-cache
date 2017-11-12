var os = require('os');
var log4js = require('log4js');
var http = require('http');
var consoleLog = console.log;

var serverName = os.hostname() || '';

function kafkaPubAppender(config, layout) {
    if(!config){
        config = {};
    }

    layout = layout || log4js.layouts.basicLayout;
    var appName = config.appName;

    return function(loggingEvent) {
        // HACK
        // last element in array is log trigger name
        var logname = '';
        if(loggingEvent.data && loggingEvent.data.length){
            var last = loggingEvent.data[loggingEvent.data.length -1 ];
            if(typeof last == 'string'){
                var index = last.indexOf('logname: ');
                if(index == 0){
                    logname = last.substring(index + 9);
                    loggingEvent.data.pop();
                }
            }
        }

        if(loggingEvent.data[loggingEvent.data.length - 1] == undefined){
            loggingEvent.data[loggingEvent.data.length - 1] = 'undefined';
        }

        var espressSession = expressSessionInfo();
        if(espressSession){
            espressSession.forEach(function(item){
                loggingEvent.data.push(item);
            });
        }

        var logMessage = layout(loggingEvent);
        var pubMessage = [
            appName, logname, loggingEvent.level.toString(), 
            logMessage, loggingEvent.startTime
        ];

        var postData = JSON.stringify({code: 'log', data: pubMessage});
        var options = {
          hostname: config.host,
          port: 10130,
          path: '/publish',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        var chunks = [];
        req = http.request(options, function(res) {
            res.on('data', function(chunk) {
                // chunks.push(chunk);
            });
            res.on('end', function() {
                // console.log(Buffer.concat(chunks).toString());
            });
            res.on('error', function(err, data) {
            });
        });
        req.on('error', function (err) {
            console.log("req error ====>>>", err);
        });
        req.write(postData);
        req.end();
    };
}

/**
* @private
* get domian/url/ip from express
*/
function expressSessionInfo(){

    var req;
    if(process.domain){
        req = process.domain._req;
    }
    if(!req) {
        return;
    }


    var array = [];
    array.push(' -_- ');
    array.push(' -_- ip: "' + req.ip + '"');
    array.push(' -_- ips: "' + req.ips + '"');
    array.push(' -_- hostname: "' + req.hostname + '"');
    array.push(' -_- url: "' + req.originalUrl + '"');
    array.push(' -_- protocol: "' + req.protocol + '"');
    array.push(' -_- cookies: "' + parseJson(req.cookies) + '"');
    array.push(' -_- signedCookies: "' + parseJson(req.signedCookies) + '"');
    array.push(' -_- body: "' + parseJson(req.body) + '"');
    array.push(' -_- xhr: "' + req.xhr + '"');

    if(serverName){
        array.push(' -_- server: "' + serverName + '"');    
    }

    Object.keys(req.headers).forEach(function(key){
        array.push(' -_- ' + key + ': "' + req.headers[key] + '"');
    });

    array.push(' -_- ');
    
    return array;
}

function parseJson(obj){
    var str = '';
    try
    {
        str = JSON.stringify(obj);
    }
    catch(e){
        // ignore
    }

    return str;
}

function configure(config) {
    var layout;
    if (config.layout) {
        layout = log4js.layouts.layout(config.layout.type, config.layout);
    }

    return kafkaPubAppender(config, layout);
}

exports.appender = kafkaPubAppender;
exports.configure = configure;