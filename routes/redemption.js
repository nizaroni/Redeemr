/**
 * Render Redemption page
 */

Redemption = require('../lib/Redemption');
redemption = new Redemption;

module.exports = function (req, res) {
	// Get redemption data
	redemption.get(req.params.id, function (err, callout) {
		if (err) return console.log('No redemption found.');

		// Is this person the redeemer?
		var redeemer = req.params.redeemer;

		callout.shortName = callout.name.split(' ')[0];
		callout.id = req.params.id;

		// Render view
		res.render('redemption', {
			title: callout.name + ' | Redeemr'
		  , callout: callout
		  , redeemer: redeemer
		  , redeemerImg: callout.fbid ? '//graph.facebook.com/' + callout.fbid + '/picture/?width=500&height=500' : '/images/chuck.jpg'
		});
	});
};