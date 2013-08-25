// Create Redis client
var db = require('../db')
    , client = db.createClient();

// Set PayPal API
var paypal_api = require('paypal-rest-sdk');

/**
 * Paypal class
 */
var Paypal = function () {
	// Configuration
	paypal_api.configure({
		'host': 'api.sandbox.paypal.com'
	  , 'port': ''
	  , 'client_id': 'AQpQXRDOuRxO818KKw6ImHdovHXAI4lmDpwrUNmJxEDi_t5-AvMAxBCpPR5P'
	  , 'client_secret': 'EFN_nBAW5M6jpGMgLjZpBKs7vzhEVDBeruQs-cRsyogpKTEIB5Gxlb0fFVZJ' 
	});
};

/**
 * Sets up the payment to send to PayPal.
 * 
 * @param  {object} paymentData Data coming from Redemption page to build payment object
 * @return {object} paymentObj  Built PayPal payment object
 */
Paypal.prototype.setupPayment = function (paymentData) {
};

/**
 * Create a PayPal payment
 * 
 * @param  {Function} callback
 * @return void
 */
Paypal.prototype.createPayment = function (options, callback) {
	var values = {
		returnUrl: options.url + '/paypal/execute/' + options.calloutId + (options.redeemer ? '/redeemer' : '')
	  , cancelUrl: options.url + '/redemption/' + options.calloutId
	  , amount: options.amount
	};

	// For now it's a PayPal payment only
	var payment = {
		"intent": "sale"
	  , "payer": {
	  		"payment_method": "paypal"
	    }
	  , "redirect_urls": {
	  		"return_url": values.returnUrl
	  	  , "cancel_url": values.cancelUrl
	  	}
	  , "transactions": [{
	  		"item_list": {
	  			"items": [{
	  				"name": "Redemption"
	  			  , "sku": "Redeemr"
	  			  , "price": values.amount
	  			  , "currency": "USD"
	  			  , "quantity": 1
	  			}]
	  		}
	  	  , "amount": {
	  	  		"currency": "USD",
	  	  		"total": values.amount
	  	  	}
	  	  , "description": "With your donation you will be making a contribution to a local non-profit."
	  	}]
	}

	paypal_api.payment.create(payment, function (err, res) {
		if (err) throw err;

		var url = require('url');
		var url = url.parse(res.links[1].href, true);

		// Save transaction token so can we know who left and who's coming back
		client.set('token:' + url.query.token, res.id);

		callback(res);
	});
};

/**
 * Execute PayPal payment after user returns from approving it from paypal.com
 * 
 * @param  {string}   payer_id ID to identify payer
 * @param  {Function} callback
 * @return void
 */
Paypal.prototype.executePayment = function (options, callback) {

	var getPayment = function (err, res) {
		if (err) return console.log('Token not found in any saved transaction.', err);

		var paymentId = res;

		paypal_api.payment.get(paymentId, function (err, res) {
			if (err) return console.log(err);

			paypal_api.payment.execute(res.id, { 'payer_id': options.payerId }, function (err, res) {
				if (err) return console.log(err);

				// We only need payment ID, state and total
				console.log(res);
				var state = res.state;
				var total = res.transactions[0].amount.total

				// If the user is the redeemer, show it to the world!
				if (options.redeemer)
					client.hset('callout:' + options.calloutId, 'redeemed', true);

				client.incrby('callout:' + options.calloutId + ':total', parseInt(total), callback);
			});
		});
	}

	// Retrieve paymentID from db by using returned token (should match with the one that was saved on createPayment)
	client.get('token:' + options.token, getPayment);
}

module.exports = Paypal;