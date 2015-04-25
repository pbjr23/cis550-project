var db;
var async = require('async');

exports.init = function(dbObj) {
	db = dbObj;
}
exports.testFunction = function(req, res) {
	db.getUserAddressAll('userA', function(err, result) {
		console.log(result);
	});
	//db.validatePassword('userD', 'abcPass', function(err, results) {
	//	console.log(results);
	//});
	//db.getRestStars('Mo3eTair_CFEw-vXQqsGEQ', function(results) {
	//	console.log(results);
	//});
	//db.getRestsSquareCoords(36.00, -115.4, 36.2, -115.2, function(results) {
	//	console.log(results);
	//});
}

exports.addUser = function(req, res) {
	db.createUser('testUser4', 'testPassword', 'testAddress', 'home', 40, -70, function(result) {
		console.log(result);
	});
}

exports.testFunction2 = function(req, res) {
    db.searchRestsByNameSubstring('Hawaiian Barbecue', function(results) {
    	async.each(results, function(resultItem, call) {
				console.log(resultItem.NAME);
			//called when results are iterated through
			}, function() {
				console.log('done');
			});
    });
}