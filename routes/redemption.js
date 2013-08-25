/**
 * Render Redemption page
 */

Redemption = require('../lib/Redemption');
redemption = new Redemption;

module.exports = function (req, res) {
	// Get redemption data
	redemption.get(req.params.id, function (err, callout) {
		if (err) return console.log('No redemption found.');	

		// Render view
		console.log(callout);
		res.render('redemption', {
			title: 'Redeem yourself',
			callout: JSON.stringify(callout)
		});
	});
};