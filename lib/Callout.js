// Create Redis client
var db = require('../db')
    , client = db.createClient();

/*************************************************************
 * Callout class
 *
 * This class handles functionality relating to user callouts.
 *************************************************************/

/**
 * Callout constructor
 *
 * @param {object} calloutData [description]
 */
var Callout = function(calloutData) {
	this.data = calloutData;
}

/**
 * Validate
 *
 * @param   Function  callback        Function to run when callout data validates
 * @return  object    curatedCallout  Validated user input
 */
Callout.prototype.validate = function(callback) {
	var callout = this.data
		, result = {};

	// If chosen by Facebook prompt, ignore manua user entry
	if (callout['callout-fb-request']) {
		result.fbid = callout['callout-fb-id'];
		result.name = callout['callout-fb-name'];
		result.request = callout['callout-fb-request'];
	}
	// Manual user entry
	else {
		result.name = callout['callout-input-name'];
		result.email = callout['callout-input-email'];
	}

	result['caller.id'] = callout['callout-user-id'];
	result['caller.name'] = callout['callout-user-name'];
	result['description'] = callout['callout-description'];

	// Send to save result
	callback(result);
};

/**
 * Save
 *
 * @param  {object}   params    Validated user input
 * @param  {Function} callback  Function to run when callout is succesfully saved
 * @return void
 */
Callout.prototype.save = function(params, callback) {
	client.incr('callout:current.id', function (err, id) {
		if (err) return callback(err);

		client.hmset('callout:' + id, params, function(err) {
			callback(err, id)
		});
	});
};

module.exports = Callout;