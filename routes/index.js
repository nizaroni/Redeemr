/**
 * GET home page.
 */

// Homepage view
module.exports.index = function (req, res) {
    res.render('index', { title: 'Redeemr | Be nice or be a Redeemr.' });
};

module.exports.channel = function (req, res) {
    res.render('channel', { layout: false });
}

// Callout form view
module.exports.callout = require('./callout');

// Redemption view
module.exports.redemption = require('./redemption');

// Paypal routes
module.exports.paypal = require('./paypal');
