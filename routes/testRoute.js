var db;
var async = require('async');

exports.init = function(dbObj) {
	db = dbObj;
}

exports.testFunction = function(req, res) {
	db.getRestsSquareCoords(40.4, -80, 40.47, -79.9, function(result) {
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