/**
 * Render callout page
 */
module.exports = function (req, res) {
	if (req.route.method === 'post') {
		// Get Callout library
		var Callout = require('../lib/Callout')
			, callout = new Callout(req.body);

		// Validate params
		callout.validate(function (params) {
			// Save params
			callout.save(params, function (err, id) {
				if (err) return console.error('There was an error saving the callout.', err);

				res.redirect('/redemption/' + id);
			});
		});
	}
	else {
	    res.render('callout', { title: 'Create a callout | Redeemr' });
	}
};