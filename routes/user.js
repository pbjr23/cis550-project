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
	  	connection.execute("SELECT * FROM restaurant WHERE rownum <= 10", 
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

function getFbId(username, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT fb_id FROM users WHERE username = " + username + "'", 
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

function getAllUserInfo(username, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT * FROM users WHERE username = '" + username + "'", 
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

function checkPassword(username, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT pass FROM password WHERE username = '" + username + "'", 
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
// STILL NEED TO IMPLEMENT
function addFriend(username, friendUsername, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("", // STILL NEED TO IMPLEMENT
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
// STILL NEED TO IMPLEMENT
function removeFriend(username, friendUsername, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("", // STILL NEED TO IMPLEMENT
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
// STILL NEED TO IMPLEMENT
function createUser(username, password, address, lat, long, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("", // STILL NEED TO IMPLEMENT
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
