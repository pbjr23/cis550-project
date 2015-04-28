/*
 * DB
 */

var db;
var async = require('async');

exports.init = function(dbObj) {
	db = dbObj;
}

exports.home = function(req, res){
	var username = req.session.username;

	//if logged in
    if (username) {
    	db.getGroups(username, function(err, groupIDs) {
    		if (err) {
    			//TODO: send to error page
    			exports.login(req, res);
    		} else {
    			var groupNames = [];
    			async.each(groupIDs, function(id, call) {
    				db.getGroupName(id, function(err, name) {
    					groupNames.push([name,id]);
    					call();
    				});
    			}, function() {
    				console.log(groupIDs);
    				console.log(groupNames);
    				res.render('home.ejs', {
    					title: 'Homepage',
    					groupNames: groupNames
    				});
    			});
    		}
    	});
    //not logged in
    } else {
    	exports.login(req, res);
    }
};

exports.results_handler = function(req, res){
    var callback = function(err, result) {
        if (err) throw err;
    };
    var members = req.body.users;
    console.log(members);

    var minLat = members[0]['LAT'];
    var maxLat = members[0]['LAT'];
    var minLong = members[0]['LON'];
    var maxLong = members[0]['LON'];
    console.log(minLat, maxLat, minLong, maxLong);

    for (var i = 0; i < members.length; i++) {
      if (members[i]['LAT'] < minLat) {
        minLat = members[i]['LAT'];
      }
      if (members[i]['LAT'] > maxLat) {
        maxLat = members[i]['LAT'];
      }
      if (members[i]['LON'] > minLong) {
        minLong = members[i]['LON'];
      }
      if (members[i]['LON'] < maxLong) {
        maxLong = members[i]['LON'];
      }
    }

    console.log(minLat, maxLat, minLong, maxLong);

    var callback = function(err, restaurants) {
        if (err) throw err;
        else {
          console.log('got inside here');
          console.log(members[0]);
          console.log(restaurants[0]);
          req.session.members = members;
          req.session.restaurants = restaurants;
          console.log("testing session");
          console.log(req.session.members[0]);
          console.log(req.session.restaurants[0]);
          res.send("success");
        }
    }

    db.getRestsSquareCoords(minLat, minLong, maxLat, maxLong, callback);


  // res.render('results.ejs', {
  //   title: 'Results'
  // });  // var members = req.body.users;


};

exports.results = function(req, res) {
  console.log(req.session.members[0]);
  console.log(req.session.restaurants[0]);
  res.render('results.ejs', {
    title: 'Results',
    members: JSON.stringify(req.session.members),
    restaurants: JSON.stringify(req.session.restaurants)
  });
}

exports.signup = function(req, res){
  res.render('signup.ejs', {
	  title: 'Sign Up'
  });
};

exports.login = function(req, res){
  res.render('login.ejs', {
	  title: 'Login'
  });
};

exports.user_profile = function(req, res){
   res.render('user_profile.ejs', {
	   title: 'User Profile'
   });
	// var callback = function(results) {
 //  	res.render('user_profile.ejs', {
	//   title: 'User Profile',
	//   address: results
 //  	});
 //  };
 //  db.getUserAddress(req.session.username, callback);
};

exports.change_password = function(req, res){
  res.render('change_password.ejs', {
	  title: 'Change Password'
  });
};

exports.change_address = function(req, res){
	var callback = function(err, results) {
		if (err) throw err;
		else {
		  res.render('change_address.ejs', {
			  title: 'Change Address',
			  address: results.ADDRESS,
			  address_label: results.ADDRESS_LABEL
		  });
		}
	}
	db.getUserAddressAll(req.session.username, callback);
};

exports.change_name = function(req, res){
	var callback = function(err, results) {
		if (err) throw err;
		else {
		  res.render('change_name.ejs', {
			  title: 'Change Name',
			  first_name: results.FIRST_NAME,
			  last_name: results.LAST_NAME
		  });
		}
	}
	db.getUserName(req.session.username, callback);
};

exports.group = function(req, res) {
	var groupID = req.query.groupID;
	// logged in username
	var username = req.session.username;
	db.getGroupMembers(groupID, function(err, members) {
		if (err) {
			// TODO: redirect to error page
		}
			db.getGroupName(groupID, function(err, groupName) {
				if (err) {
					// TODO: redirect to error page
				}
				// if user is in the group
				if (members.indexOf(username) !== -1) {
					console.log(username + " is in the group!");
					var names = [];
					var addresses = [];
					var usersObjs = [];
					async.each(members, function(userID, call) {
						db.getAllUserInfo(userID, function(err, obj) {
							if (err) {
								// TODO: redirect to error page
							}
							var fullName = obj.FIRST_NAME + " "
												+ obj.LAST_NAME;
							names.push(fullName);
							addresses.push(obj.ADDRESS);
							usersObjs.push(obj);
							call();
						})
					}, function() {
						var userJSON = JSON.stringify(usersObjs);
						console.log(userJSON);
                        console.log(username);
						res.render('group.ejs', {
							title: groupName,
							memberNames: names,
							usernames: members,
							addresses: addresses,
							groupID: groupID,
							users: userJSON,
                            username: username
						});
					});
				// user is not in the group
				} else {
					console.log(username + " is not in the group!");
					res.render('group.ejs', {
								title: 'user is not in ' + groupName,
								memberNames: [],
								usernames: [],
								addresses: [],
								groupID: groupID
							});
		}
			});

	});
};

exports.addUserToGroup = function(req, res) {
	var username = req.body.username;
	var groupID = req.body.groupID;
	db.addUserToGroup(groupID, username, function(err, results) {
		if (err) {
			res.send("1");
		} else {
			res.send("0");
		}
	});
}

exports.removeUserFromGroup = function(req, res) {
	var groupID = req.body.groupID;
	var username = req.body.username;
	db.removeUserFromGroup(groupID, username, function(err, results) {
		if (err) {
			console.log(err);
		} else {
			db.getGroupMembers(groupID, function(err, members) {
				if (err) {
					res.send("1");
				} else {
					res.send("0");
				}
			});
		}
	})
}

/*
 * Create new user
 */

exports.create_user = function(req, res){

	var callback = function(result) {
		req.session.username = req.body.username;
		//res.send("");
	};
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);
	geocoder.geocode(req.body.address, function(err, results) {
  	if (results.length == 1) {
  		res.send("success");
  		console.log(results);
  		console.log("Facebook id: " + req.session.fb_id);
  		if (req.session.fb_id)
  			db.createFacebookUser(req.body.username, req.body.password, req.body.first_name,
	  			req.body.last_name, req.body.address, req.body.label,
	  			results[0].latitude, results[0].longitude, req.session.fb_id, callback);
  		else 
	  		db.createUser(req.body.username, req.body.password, req.body.first_name,
	  			req.body.last_name, req.body.address, req.body.label,
	  			results[0].latitude, results[0].longitude, callback);
  	}
  	else {
  		res.send("failure");
  	}
	});
	// db.createUser(req.body.username, req.body.password, req.body.address,
	// 	req.body.label, req.body.lat, req.body.lon, callback);

};

exports.address_to_lat_and_lon_tester = function(req, res){

	// var callback = function(result) {
	// 	req.session.username = req.body.username;
	// 	req.session.address = req.body.address;
	// 	req.session.address_label = req.body.address_label;
	// 	res.send("");
	// };
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);
	geocoder.geocode(req.body.address, function(err, results) {
  	if (results.length == 1) console.log("Latitude: " + results[0].latitude + " Longitude: " + results[0].longitude);
  	else console.log("Insert Valid Address");
  });
		//callback;
	// geocoder.geocode(req.body.address)
 //    .then(function(res) {
 //        if (res.length > 0) console.log("Latitude: " + res[0].latitude + " Longitude: " + res[0].longitude);
 //        else console.log("Insert Valid Address");
 //    })
 //    .catch(function(err) {
 //        console.log(err);
 //    });
	// db.createUser(req.body.username, req.body.password, req.body.address,
	// 	req.body.label, req.body.lat, req.body.lon, callback);

};

exports.get_fb_user_username = function(req, res){

	var callback = function(err, result) {
		if (err)
			throw err;
		else {
			if (result) {
				console.log("successful facebook login");
				req.session.username = result;
				console.log("username:" + result);
				res.send("success");

			}
			else {
				res.send("failure");
				console.log("failed facebook login");
			}
		}
	};

	req.session.fb_id = req.body.fb_id;
	db.getUsername(req.session.fb_id, callback);
};

exports.check_username = function(req, res){

	var callback = function(err, result) {
		if (err)
			throw err;
		else {
			if (result) {
				res.send("success");
			}
			else
				res.send("failure");
		}
	};

	db.checkUsernameExists(req.body.username, callback);

};

exports.check_pass = function(req, res){

	var callback = function(err, result) {
		if (err)
			throw err;
		else {
			if (result) {
				req.session.username = req.body.username;
				res.send("success");
			}
			else
				res.send("failure");
		}
	};

	db.validatePassword(req.body.username, req.body.password, callback);

};

exports.edit_name = function(req, res){

	var callback = function(err, result) {
		if (err) throw err;
	};
	res.send("success");
	db.changeUserFirstLastName(req.session.username, req.body.first_name,
		req.body.last_name, callback);

};

exports.edit_pass = function(req, res){

	var callback = function(err, result) {
		if (err) throw err;
	};
	res.send("success");
	db.changePassword(req.session.username, req.body.password, callback);

};

exports.edit_address = function(req, res){

	var callback = function(err, result) {
		if (err) throw err;
	};

  var geocoderProvider = 'google';
	var httpAdapter = 'http';
	var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);
	geocoder.geocode(req.body.address, function(err, results) {
  	if (results.length == 1) {
  		 res.send("success");
  		console.log("Latitude: " + results[0].latitude + " Longitude: " + results[0].longitude);
  		db.changeUserAddressLatLon(req.session.username, req.body.address, req.body.address_label,
		  results[0].latitude, results[0].longitude, callback);
  	}
  	else {
  		rest.send("failure");
  		console.log("Insert Valid Address");
  	}
	});
};

/*
 * Searches for restaurants
 */

exports.group_search = function(req, res){

	var callback = function(result) {
		res.send(result);
	};

	db.getRestsSquareCoords(req.body.minlat, req.body.minlong,
		req.body.maxlat, req.body.maxlong, callback);

};

exports.create_group = function(req, res){

	var callback = function(err, result) {
		if (err)
			throw err;
		else {
			console.log(result)
			var callback2 = function(err2, result2) {
				if (err2)
					throw err2;
				else {
					console.log(result2);
					console.log(result);
					res.send(result.toString());
				}
			};
			db.addUserToGroup(result, req.session.username, callback2);
		}
	};

	db.createGroup(req.query.groupName ,callback);

};



exports.logout = function(req, res){

	req.session.username = null;
	res.send("");

};



