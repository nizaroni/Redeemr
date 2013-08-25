var redis = require('redis')
    , config = require('./config')
;

function createClient () {
    var client;
    if (!config.REDISTOGO) {
         client = redis.createClient();
    } else {
        client = redis.createClient(config.REDISTOGO.port, config.REDISTOGO.hostname);
        client.auth(config.REDISTOGO.auth);
    }
    return client;
}

module.exports.createClient = createClient;
