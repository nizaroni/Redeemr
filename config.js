var sendgridUrl = process.env.SENDGRID_URL || 'user:password'
    , sendgridCredentials = sendgridUrl.split(':')
;

module.exports.SENDGRID = {
    username: sendgridCredentials[0]
    , password: sendgridCredentials[1]
};
