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

function getGroupName(int groupID, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT group_name FROM groups WHERE group_id = " + groupID, 
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

function getGroups(String username, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT group_id FROM in_group WHERE username = '" + username "'", 
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

function getGroupMembers(int groupID, callback) {
	oracle.connect(connectData, function(err, connection) {
		if (err) {
			console.log(err);
		} else {
			connection.execute("SELECT username FROM in_group WHERE group_id = " + groupID, 
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
function removeUserFromGroup(int groupID, String username, callback) {
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
function addUserToGroup(int groupID, String username, callback) {
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
function createGroup(String username, String groupName, callback) {
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
function deleteGroup(int groupID, callback) {
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
function editGroupName(int groupID, String newName, callback) {
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
