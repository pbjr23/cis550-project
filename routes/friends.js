// Connect string to Oracle
var connectData = { 
  "hostname": "yelpequidistance.cqf3bokykxqv.us-east-1.rds.amazonaws.com", 
  "user": "equidist", 
  "password": "helpyelp450", 
  "database": "equiDB" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * FROM friends WHERE rownum <= 10", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	console.log(results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function getFriends(username, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT user2 FROM friends WHERE user1 = '" + username "'", 
			       [], function(err, results) {
				if (err) {
					console.log(err);
				} else {
					callback(results);
				}
			});
		}
	});
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res,req.query.name);
};
