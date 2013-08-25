var url = require('url')
    , sendgridUrl = process.env.SENDGRID_URL || 'user:password'
    , sendgridCredentials = sendgridUrl.split(':')
    , redisUrl = process.env.REDISTOGO_URL
    , redistogo
    , auth
;

module.exports.SENDGRID = {
    username: sendgridCredentials[0]
    , password: sendgridCredentials[1]
};

if (!redisUrl) {
    module.exports.REDISTOGO = false;
} else {
    redistogo = url.parse(redisUrl);
    module.exports.REDISTOGO = {
        port: redistogo.port
        , hostname: redistogo.hostname
        , auth: redistogo.auth.split(':')[1]
    };
}
