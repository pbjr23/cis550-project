(function() {

	// Connect string to Oracle
	var connectData = { 
	  "hostname": "yelpequidistance.cqf3bokykxqv.us-east-1.rds.amazonaws.com", 
	  "user": "equidist", 
	  "password": "helpyelp450", 
	  "database": "equiDB" };

	var oracle =  require("oracle");

	//constructor
	function db() {

	};

	db.prototype.getRestInfo = function(bussID, callback) {
		console.log("getRestInfo: " + bussID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT * FROM restaurant WHERE rid ='" + bussID + "'", 
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

	db.prototype.getRestName = function(bussID, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT name FROM restaurant WHERE rid ='" + bussID + "'", 
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

	db.prototype.getRestAddress = function(bussID, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT address FROM restaurant WHERE rid = '" + bussID + "'", 
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

	db.prototype.searchRestsByName = function(name, callback) {
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

	db.prototype.searchRestsByNameSubstring = function(name, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT * FROM restaurant WHERE name LIKE '%" + name + "%'", 
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

	db.prototype.getRestLatLong = function(bussID, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT lat, lon FROM restaurant WHERE rid ='" + bussID + "'", 
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

	db.prototype.getRestStars = function(bussID, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT stars FROM restaurant WHERE rid ='" + bussID + "'", 
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

	db.prototype.getRestsSquareCoords = function(minLat, minLon, maxLat, maxLon, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT * FROM restaurant WHERE lat >= " + minLat + 
					     " AND lon >= " + minLon + " AND lat <= " + maxLat + 
					     " AND lon <= " + maxLon, 
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

	db.prototype.getUserAddress = function(username, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT address FROM address WHERE username = '" + username + "'", 
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

	db.prototype.getUserLatLon = function(username, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT lat, lon FROM address WHERE username = '" + username + "'", 
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

	db.prototype.getFriends = function(username, callback) {
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

	module.exports = db;

}());