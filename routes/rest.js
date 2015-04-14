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
//	  	    	output_actors(res, name, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function getRestInfo(bussID, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT * FROM restaurant WHERE rid = " + bussID, 
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

function getRestName(bussID, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT name FROM restaurant WHERE rid = " + bussID, 
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

function getRestAddress(bussID, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT address FROM restaurant WHERE rid = " + bussID, 
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

function searchRestsByName(name, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT * FROM restaurant WHERE name = '" + name + "'", 
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

function getRestLatLong(bussID, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT lat, long FROM restaurant WHERE rid = " + bussID, 
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

function getRestStars(bussID, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT stars FROM restaurant WHERE rid = " + bussID, 
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

function getRests(minLat, minLong, maxLat, maxLong, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT * FROM restaurant WHERE lat >= " + minLat + 
				     " AND long >= " + minLong + " AND lat <= " + maxLat + 
				     " AND long <= " + maxLong, 
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
