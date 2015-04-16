var db;
var async = require('async');

exports.init = function(dbObj) {
	db = dbObj;
}
exports.testFunction = function(req, res) {
	db.deleteGroup(1, function(results) {
		console.log(results);
	});
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