/**
 * Render callout page
 */
var Callout = require('../lib/Callout')
	, email = require('../lib/email')
;

module.exports = function (req, res) {
	var callout;
	if (req.route.method === 'post') {
		// Get Callout library
		callout = new Callout(req.body);

		// Validate params
		callout.validate(function (params) {
			// Save params
			callout.save(params, function (err, id) {
				var port = req.app.settings.port
					, baseUrl
				;
				port = port ? (':' + port) : ''
				baseUrl = 'http://' + req.host + port
				if (err) {
					console.error('There was an error saving the callout.', err);
					return res.json(503, { error: err });
				}

				if (email.isEmailCallout(req.body)) {
					email.sendCallout(baseUrl, id, req.app, req.body);
				}

				res.json(201, { calloutId: id });
			});
		});
	}
	else {
	    res.render('callout', { title: 'Call out a friend | Redeemr' });

	}
};
