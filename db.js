(function() {

	// Connect string to Oracle
	var connectData = { 
	  "hostname": "yelpequidistance.cqf3bokykxqv.us-east-1.rds.amazonaws.com", 
	  "user": "equidist", 
	  "password": "helpyelp450", 
	  "database": "equiDB" };

	var oracle =  require("oracle");
	var async = require('async');
	var crypto = require('crypto'),
		key = 'helpYelp_secretKey';

	//constructor
	function db() {

	};

	function encryptPassword(pass, callback) {
		var cipher = crypto.createCipher('aes-256-cbc', key);
		var encrypted = cipher.update(pass, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		
		console.log("unencrypted: " + pass);
		console.log("adding encrypted password: " + encrypted);
		
		callback(encrypted);
	}

	function decryptPassword(pass, callback) {
		//decrypt password from DB
		var decipher = crypto.createDecipher('aes-256-cbc', key);
		var decrypted = 
			decipher.update(pass, 'base64', 'utf8');
		decrypted += decipher.final('utf8');
		
		console.log('decrypted pass: ' + decrypted);
		
		callback(decrypted);
	}

	/* restaurant table methods */
	// returns a single object with all info for restaurant
	db.prototype.getRestInfo = function(bussID, callback) {
		console.log('getRestInfo: ' + bussID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT * FROM restaurant WHERE rid ='" + bussID + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						//will only be 1 result for a rid
						callback(null, results[0]);
					}
				});
			}
		});
	}
	//returns string that is the restaurant name
	db.prototype.getRestName = function(bussID, callback) {
		console.log('getRestName: ' + bussID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT name FROM restaurant WHERE rid ='" + bussID + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0].NAME);
					}
				});
			}
		});
	}
	//returns string of the restaurant's address
	db.prototype.getRestAddress = function(bussID, callback) {
		console.log('getRestAddress: ' + bussID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT address FROM restaurant WHERE rid = '" + bussID + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0].ADDRESS);
					}
				});
			}
		});
	}
	//returns array of objects with all info for each restaurant
	db.prototype.searchRestsByNameSubstring = function(name, callback) {
		console.log('searching restaurants whose name contains: ' + name);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT * FROM restaurant WHERE name LIKE '%" + name + "%'", [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}
	// returns single object with 2 fields, e.g. { LAT: 35.00, LON: -115 }
	db.prototype.getRestLatLong = function(bussID, callback) {
		console.log('getRestLatLong: ' + bussID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT lat, lon FROM restaurant WHERE rid ='" + bussID + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0]);
					}
				});
			}
		});
	}
	// returns number value
	db.prototype.getRestStars = function(bussID, callback) {
		console.log('getRestStars: ' + bussID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT stars FROM restaurant WHERE rid ='" + bussID + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0].STARS);
					}
				});
			}
		});
	}
	// returns array of objects, each with all info for a restaurant
	db.prototype.getRestsSquareCoords = function(minLat, minLon, maxLat, maxLon, callback) {
		console.log('getting restaurants within: lat(min: ' + minLat 
			+ ',max: ' + maxLat + ')  lon(min: ' + minLon + ',max: ' 
			+ maxLon + ')');
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				//gives top 10 results according to stars
				var q = "SELECT *"
						+ " FROM (select * from restaurant"
						+ " WHERE lat >= " + minLat
						+ " AND lon >= " + minLon
						+ " AND lat <= " + maxLat
						+ " AND lon <= " + maxLon
						+ "	ORDER BY stars DESC) WHERE ROWNUM <= 10";
				connection.execute(q, [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}

	/* address table methods */
	// returns single string of the user's address
	db.prototype.getUserAddress = function(username, callback) {
		console.log('getUserAddress: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT address FROM address WHERE username = '" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0].ADDRESS);
					}
				});
			}
		});
	}
	// returns single object with 2 fields, e.g. { LAT: 35.00, LON: -115 }
	db.prototype.getUserLatLon = function(username, callback) {
		console.log('getUserLatLon: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT lat, lon FROM address WHERE username = '" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0]);
					}
				});
			}
		});
	}
	//returns single object with all columns in address table
	// sample format: { ADDRESS_LABEL: 'home',
  	//                  USERNAME: 'userA',
  	//					ADDRESS: 'testAddress',
  	//					LAT: 40,
  	// 					LON: -70 }
	db.prototype.getUserAddressAll = function(username, callback) {
		console.log('getting user address info for: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT * FROM address WHERE username = '" 
					+ username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0]);
					}
				});
			}
		});
	}

	db.prototype.changeUserAddressLatLon = 
		function(username, newAddress, newLabel, newLat, newLon, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("UPDATE address "
					+ "SET address ='" + newAddress
					+ "', address_label='" + newLabel
					+ "', lat =" + newLat
					+ ", lon =" + newLon
					+ " WHERE username='" + username + "'",
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}

	// returns boolean
	db.prototype.checkUsernameExists = function(username, callback) {
		console.log('checking whether username exists: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT * FROM users WHERE username = '" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results.length !== 0);
					}
				});
			}
		});
	}

	// returns single object with format { FIRST_NAME: 'abc', LAST_NAME: 'def'}
	db.prototype.getUserName = function(username, callback) {
		console.log('getting name of user: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT first_name, last_name FROM users WHERE username = '" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0]);
					}
				});
			}
		});
	}

	db.prototype.changeUserFirstName = function(username, newFirstName, callback) {
		console.log('changing first name of user: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("UPDATE users SET first_name ='" 
					+ newFirstName + "' WHERE username='" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}

	db.prototype.changeUserLastName = function(username, newLastName, callback) {
		console.log('changing last name of user: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("UPDATE users SET last_name ='" 
					+ newFirstName + "' WHERE username='" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}

	db.prototype.changeUserFirstLastName = function(username, newFirstName, newLastName, callback) {
		console.log('changing name of user: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("UPDATE users SET first_name ='" 
					+ newFirstName + "', last_name ='"
					+ newLastName + "' WHERE username='" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}


	/* friends table methods */
	// returns array of usernames
	db.prototype.getFriends = function(username, callback) {
		console.log('getting friends of: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT user2 FROM friends WHERE user1 = '" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						var userResults = [];
						async.each(results, function(user2, call) {
							userResults.prototype.push(user2.USER2);
							call();
						}, function() {
							connection.close();
							callback(null, userResults);
						});
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
				callback(err, null);
			} else {
				connection.execute('INSERT INTO friends (user1, user2) '
					+ "VALUES ('" + username + "','" + friendUsername + "')",
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
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
				callback(err, null);
			} else {
				connection.execute("DELETE FROM friends WHERE user1='" + 
					username + "' AND user2='" + friendUsername + "'",
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}

	db.prototype.removeAllFriends = function(username, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("DELETE FROM friends WHERE user1='" + 
					username + "'",
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
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
				callback(err, null);
			} else {
				connection.execute("SELECT fb_id FROM users WHERE username ='" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0].FB_ID);
					}
				});
			}
		});
	}

	db.prototype.getUsername = function(fb_id, callback) {
		console.log('getting username of: ' + fb_id);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT username FROM users WHERE fb_id =" + fb_id, 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						if (results[0])
							callback(null, results[0].USERNAME);
						else
							callback(null, null);
					}
				});
			}
		});
	}

	/* returns single object, format: { USERNAME: 'abc', 
	 *                                  FB_ID: 123,
	 * 									PASSWORD: 'pass',
	 * 									ADDRESS_LABEL: 'home',
	 *									ADDRESS: 'address',
	 * 									LAT: 40,
	 * 									LON: -70,
	 *									FIRST_NAME: 'abc',
	 * 									LAST_NAME: 'abc'}
	*/
	db.prototype.getAllUserInfo = function(username, callback) {
		console.log('getting all user info of: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT * FROM users U "
					+ "INNER JOIN address A ON U.username = A.username "
					+ "WHERE U.username = '" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0]);
					}
				});
			}
		});
	}

	db.prototype.createUser = function(username, password, 
									first_name, last_name, 
									address, addressLabel, 
									lat, lon, callback) {
		console.log('adding user: ' + username);
		encryptPassword(password, function(encryptedPass) {
			oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("INSERT INTO users (username,password,"
					+ "first_name,last_name) "
					+ "VALUES ('" + username + "','" + encryptedPass
					+ "','" + first_name + "','" + last_name + "')",
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						console.log(results);
						oracle.connect(connectData, function(err, connection) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
					connection.execute(
					"INSERT INTO address (address_label,username,address,lat,lon) "
					+ "VALUES ('" + addressLabel + "','" + username + "','" + address + "'," + lat + "," + lon + ")",
					       [], function(err, results2) {
						if (err) {
							console.log(err);
							callback(err, null);
						} else {
							connection.close();
							callback(null, results2);
						}
					});
				}
			});
					}
				});
			}
		});
		});
	}

	db.prototype.createFacebookUser = function(username, password, 
									first_name, last_name, 
									address, addressLabel, 
									lat, lon, fb_id, callback) {
		console.log('adding user: ' + username);
		encryptPassword(password, function(encryptedPass) {
			oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("INSERT INTO users (username,password,"
					+ "fb_id,first_name,last_name) "
					+ "VALUES ('" + username + "','" + encryptedPass
					+ "'," + fb_id + ",'" + first_name + "','" + last_name + "')",
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						console.log(results);
						oracle.connect(connectData, function(err, connection) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
					connection.execute(
					"INSERT INTO address (address_label,username,address,lat,lon) "
					+ "VALUES ('" + addressLabel + "','" + username + "','" + address + "'," + lat + "," + lon + ")",
					       [], function(err, results2) {
						if (err) {
							console.log(err);
							callback(err, null);
						} else {
							connection.close();
							callback(null, results2);
						}
					});
				}
			});
					}
				});
			}
		});
		});
	}

	// returns boolean indicating whether the entered password is correct
	db.prototype.validatePassword = function(username, enteredPass, callback) {
		console.log('getting password for: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT password FROM users WHERE username = '" + username + "'",
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						decryptPassword(results[0].PASSWORD, 
							function(decrypted) {
								connection.close();
								callback(null, decrypted === enteredPass);
						});
					}
				});
			}
		});
	}

	db.prototype.changePassword = function(username, newPass, callback) {
		console.log('changing password for: ' + username);
		encryptPassword(newPass, function(encryptedPass) {
			oracle.connect(connectData, function(err, connection) {
				if (err) {
					console.log(err); 
					callback(err, null);
				} else {
					connection.execute("UPDATE users "
						+ "SET password='" + encryptedPass + "' "
						+ "WHERE username = '" + username + "'",
					       [], function(err, results) {
						if (err) {
							console.log(err); 
							callback(err, null);
						} else {
							connection.close();
							callback(null, results);
						}
					});
				}
			});
		});
	}

	//returns string that is decrypted password
	/*
	db.prototype.getPassword = function(username, callback) {
		console.log('getting password for: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); callback(err, null);
			} else {
				connection.execute("SELECT password FROM users WHERE username = '" + username + "'",
				       [], function(err, results) {
					if (err) {
						console.log(err); callback(err, null);
					} else {
						decryptPassword(results[0].PASSWORD, callback);
					}
				});
			}
		});
	}
	*/

	/* groups table methods */
	db.prototype.getGroupName = function(groupID, callback) {
		console.log('getting group name for: ' + groupID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT group_name FROM groups WHERE group_id = " + groupID, 
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(null, results[0].GROUP_NAME);
					}
				});
			}
		});
	}
	// returns array of group ids, which are numbers
	db.prototype.getGroups = function(username, callback) {
		console.log('getting groups where user is in: ' + username);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT group_id FROM in_group WHERE username = '" + username + "'", 
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						var ids = [];
						async.each(results, function(idObj, call) {
							ids.push(idObj.GROUP_ID);
							call();
						}, function() {
							connection.close();
							callback(null, ids);
						});
					}
				});
			}
		});
	}
	// returns array of usernames which are strings
	db.prototype.getGroupMembers = function(groupID, callback) {
		console.log('getting group members of groupID: ' + groupID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT username FROM in_group WHERE group_id =" + groupID, 
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						var usernames = [];
						async.each(results, function(userObj, call) {
							var name = userObj.USERNAME;
							usernames.push(name);
							call();
						}, function() {
							connection.close();
							callback(null, usernames);
						});
					}
				});
			}
		});
	}
	
	db.prototype.removeUserFromGroup = function (groupID, username, callback) {
		console.log('removing user: ' + username + ', from group: ' + groupID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("DELETE FROM in_group WHERE username='" 
					+ username + "' AND group_id=" + groupID,
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}
	
	db.prototype.addUserToGroup = function(groupID, username, callback) {
		console.log('adding user: ' + username + ', to group: ' + groupID);
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("INSERT INTO in_group (group_id, username) "
					+ "VALUES (" + groupID + ",'" + username + "')",
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}
	
	function getNextAvailalbleGroupId(callback) {
		console.log('getting max group_id');
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("SELECT MAX(group_id) AS maxID FROM groups",
				       [], function(err, results) {
					if (err) {
						console.log(err); 
						callback(err, null);
					} else {
						connection.close();
						callback(results[0].MAXID);
					}
				});
			}
		});
	}
	//returns new group ID
	db.prototype.createGroup = function(groupName, callback) {
		getNextAvailalbleGroupId(function(maxID){
			var groupID = maxID + 1;
			console.log("new groupID: " + groupID);
			console.log('creating group: ' +  groupName 
				+ ' with groupID: ' + groupID);
			oracle.connect(connectData, function(err, connection) {
				if (err) {
					console.log(err);
					callback(err, null);
				} else {
					connection.execute("INSERT INTO groups " 
						+ "(group_id, group_name) VALUES (" + groupID + ",'"
					    + groupName + "')",
					       [], function(err, results) {
						if (err) {
							console.log(err);
							callback(err, null);
						} else {
							connection.close();
							callback(null, groupID);
						}
					});
				}
			});
		});
	};
		
	db.prototype.deleteGroup = function(groupID, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err);
				callback(err, null);
			} else {
				//delete users from in_group
				connection.execute("DELETE FROM in_group WHERE group_id=" 
					+ groupID,
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						//delete group from groups
						oracle.connect(connectData, function(err, connection) {
							if (err) {
								console.log(err);
								callback(err, null);
							} else {
								connection.execute(" DELETE FROM groups WHERE group_id=" + groupID,
								       [], function(err, results) {
									if (err) {
										console.log(err); 
										callback(err, null);
									} else {
										connection.close();
										callback(null, results);
									}
								});
							}
						});
					}
				});
			}
		});
	}

	db.prototype.renameGroup = function(groupID, newName, callback) {
		oracle.connect(connectData, function(err, connection) {
			if (err) {
				console.log(err); 
				callback(err, null);
			} else {
				connection.execute("UPDATE groups SET group_name ='" + newName
					+ "' WHERE group_id=" + groupID,
				       [], function(err, results) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else {
						connection.close();
						callback(null, results);
					}
				});
			}
		});
	}	

	module.exports = db;

}());
