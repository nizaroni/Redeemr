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
	this.data = calloutInput;
}

/**
 * Validate
 * 
 * @param   Function  callback        Function to run when callout data validates
 * @return  object    curatedCallout  Validated user input
 */
Callout.prototype.validate = function(callback) {
	curatedCallout = this.callout;

	callback(curatedCallout);
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
		client.hmset('callout:' + id, params, callback);
	});
}

module.exports = Callout;