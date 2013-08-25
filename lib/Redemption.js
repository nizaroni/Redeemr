// Create Redis client
var db = require('../db')
    , client = db.createClient();

/*************************************************************
 * Redemption class
 *
 * This class takes care of displaying the Redemption data and
 * PayPal payment interface.
 *************************************************************/

var Redemption = function () {

};

Redemption.prototype.get = function (id, callback) {
	client.hgetall('callout:' + id, callback);
};

module.exports = Redemption;