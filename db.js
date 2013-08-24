var redis = require('redis');

function createClient () {
    return redis.createClient();
}

module.exports.createClient = createClient;
