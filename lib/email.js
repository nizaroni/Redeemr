var config = require('../config')
    , sendgrid = require('sendgrid')(config.SENDGRID.username, config.SENDGRID.password)
;

function Email () {}

Email.prototype.isEmailCallout = function (data) {
    return !data['callout-fb-id']
        && !data['callout-fb-name']
        && data['callout-input-email']
        && data['callout-input-name']
    ;
};

Email.prototype.sendCallout = function (baseUrl, calloutId, data) {
    sendgrid.send({
        to: data['callout-input-email']
        , from: 'callout@redeemr.pw'
        , fromname: data['callout-user-name'] + ' (Redeemr)'
        , subject: data['callout-user-name'] + ' has called you out on Redeemr!'
        , text: [
            'Admit it, you did something wrong. Here’s your chance to redeem yourself. Compensate for your fault by making a contribution to the community.'
            , ''
            , 'Redeemr is a virtual douchebag jar. The purpose is to help correct someone’s bad behavior by making a contribution to the community. The person will put money in the jar for anything he says or does that is considered douchey.'
            , ''
            , 'By redeeming yourself, you will be making a contribution to a non-profit organization.'
            , ''
            , 'Redeem yourself!: ' + baseUrl + '/redemption/' + calloutId + '/redeemr'
        ].join('\n')
    });
};

module.exports = new Email();
