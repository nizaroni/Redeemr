/**
 * GET home page.
 */

// Homepage view
module.exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};

// Callout form view
module.exports.callout = require('./callout');
module.exports.callout = require('./callout');