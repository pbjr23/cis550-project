/*
 * DB
 */

var db;
var async = require('async');

exports.init = function(dbObj) {
	db = dbObj;
}

exports.home = function(req, res){
  // if logged in 
  if (req.session.username != null) {
  	var callback = function(err, results) { 
  		if (err) throw err;
  		else {
  			res.render('home.ejs', { 
	  			title: 'Homepage',
	  			groups: results
  			});
  		}
  	};
  	db.getGroups(req.session.username, callback); 
  }
  // render login page 
  else 
	exports.login(req,res);
}; 

exports.results = function(req, res){
  res.render('results.ejs', { 
	  title: 'Results' 
  });
};

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
	db.getGroupMembers(groupID, function(err, members) {
		if (err) {
			// TODO: redirect to error page
		}
		db.getGroupName(groupID, function(err, groupName) {
			if (err) {
				// TODO: redirect to error page
			}
			var names = [];
			async.each(members, function(userID, call) {
				db.getUserName(userID, function(err, nameObj) {
					// TODO: redirect to error page
					var fullName = nameObj.FIRST_NAME + " " 
										+ nameObj.LAST_NAME;
					names.push(fullName);
					call();
				})
			}, function() {
				res.render('group.ejs', {
					title: groupName,
					memberNames: names,
					usernames: members,
					groupID: groupID
				});
			});
		});
	});
};

exports.removeUserFromGroup = function(req, res) {
	var groupID = req.query.groupID;
	var username = req.query.username;
	console.log(groupID + " " + username);
	db.removeUserFromGroup(groupID, username, function(err, results) {
		if (err) {
			console.log(err);
		} else {
			db.getGroupMembers(groupID, function(err, members) {
				if (err) {
					// TODO: redirect to error page
				}
				db.getGroupName(groupID, function(err, groupName) {
					if (err) {
						// TODO: redirect to error page
					}
					var names = [];
					async.each(members, function(userID, call) {
						db.getUserName(userID, function(err, nameObj) {
							// TODO: redirect to error page
							var fullName = nameObj.FIRST_NAME + " " 
												+ nameObj.LAST_NAME;
							names.push(fullName);
							call();
						})
					}, function() {
						res.render('group.ejs', {
							title: groupName,
							memberNames: names,
							usernames: members,
							groupID: groupID
						});
					});
				});
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



