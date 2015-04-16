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

	/* restaurant table methods */

	db.prototype.getRestInfo = function(bussID, callback) {
		console.log('getRestInfo: ' + bussID);
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
		console.log('getRestName: ' + bussID);
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
		console.log('getRestAddress: ' + bussID);
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
		console.log('searching restaurants by full name: ' + name);
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
		console.log('searching restaurants whose name contains: ' + name);
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
		console.log('getRestLatLong: ' + bussID);
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
		console.log('getRestStars: ' + bussID);
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
		console.log('getting restaurants within: lat(min: ' + minLat 
			+ ',max: ' + maxLat + ')  lon(min: ' + minLon + ',max: ' 
			+ maxLon + ')');
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
	


	/* address table methods */

	db.prototype.getUserAddress = function(username, callback) {
		console.log('getUserAddress: ' + username);
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
		console.log('getUserLatLon: ' + username);
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


	/* friends table methods */

	db.prototype.getFriends = function(username, callback) {
		console.log('getting friends of: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT user2 FROM friends WHERE user1 = '" + username + "'", 
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

	db.prototype.addFriend = function(username, friendUsername, callback) {
		console.log('adding friend for user: ' + username 
			+ ', friend: ' + friendUsername);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute('INSERT INTO friends (user1, user2) '
					+ "VALUES ('" + username + "','" + friendUsername + "')",
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

	db.prototype.removeSingleFriend = function(username, friendUsername, callback) {
		console.log('removing friend for user: ' + username 
			+ ', friend: ' + friendUsername);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("DELETE FROM friends WHERE user1='" + 
					username + "' AND user2='" + friendUsername + "'",
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

	db.prototype.removeAllFriends = function(username, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("DELETE FROM friends WHERE user1='" + 
					username + "'",
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

	/* users table methods */

	db.prototype.getFbId = function(username, callback) {
		console.log('getting FBid of: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute("SELECT fb_id FROM users WHERE username = '" + username + "'", 
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

	db.prototype.getAllUserInfo = function(username, callback) {
		console.log('getting all user info of: ' + username);
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

	db.prototype.createUser = function(username, password, address, addressLabel, lat, lon, callback) {
		console.log('adding user: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				//add to users table
				connection.execute("INSERT INTO users (username) "
					+ "VALUES ('" + username + "'",
				       [], function(err, results) {
					if (err) {
						console.log(err);
					} else {
						//add to password table
						oracle.connect(connectData, function(err, connection) {
							if (err) {
								console.log(err);
							} else {
								connection.execute("INSERT INTO users (username,pass) "
					+ "VALUES ('" + username + "','" + password + "')",
								       [], function(err, results) {
									if (err) {
										console.log(err);
									} else {
										oracle.connect(connectData, function(err, connection) {
											if (err) {
												console.log(err);
											} else {
												connection.execute(
					"INSERT INTO address (addressLabel,username,address,lat,lon) "
					+ "VALUES ('" + addressLabel + "','" + username + "'," + address + "'," + lat + "," + lon + ")",
												       [], function(err, results) {
													if (err) {
														console.log(err);
													} else {
														callback(results);
													}
												});
											}
										});
										callback(results);
									}
								});
							}
						});
						callback(results);
					}
				});
			}
		});
	}


	/* password table methods */
	db.prototype.getPassword = function(username, callback) {
		console.log('getting password for: ' + username);
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

	


	module.exports = db;

}());
