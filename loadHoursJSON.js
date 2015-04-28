(function() {
	var aws = require('./keyvaluestore.js'),
	    hours = new aws('hours');
	var fs = require('fs');

	hours.init(function(){
		var obj;
		fs.readFile('hours_data.json', function(err, data) {
			if (err) {
				throw err;
			}
			obj = JSON.parse(data);

			// for each business id
			for (var bid in obj) {
				console.log(bid + ' -> ' + obj[bid]);
				hours.put(bid, JSON.stringify(obj[bid]), function(){});		
			}
		})
	});
	
})();