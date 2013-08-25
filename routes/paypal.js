var Paypal = require('../lib/Paypal');
var paypal = new Paypal();

module.exports.create = function (req, res) {
	var options = {
		'url': 'http://' + req.host + (req.app.settings.port ? ':' + req.app.settings.port : '')
	  , 'calloutId': req.params.id 
	  , 'redeemer': req.params.redeemer
	  , 'amount': req.body.customAmount ? req.body.customAmount : req.body.defaultAmount
	}

	paypal.createPayment(options, function (response) {
		// Send user to PayPal to approve their donation
		links = response.links.filter(function (value) {
			return value.rel === 'approval_url'
		});

		approval_url = links[0].href;

		res.redirect(approval_url);
	});
};

// Execute payment once user comes back from PayPal
module.exports.execute = function (req, res) {
	var options = {
		calloutId: req.params.id
	  , payerId: req.query.PayerID
	  , token: req.query.token
	  , redeemer: req.params.redeemer
	}

	paypal.executePayment(options, function (error, response) {
		// If payment went through, send back to redemption page
		res.redirect('/redemption/' + options.calloutId);
	});
};