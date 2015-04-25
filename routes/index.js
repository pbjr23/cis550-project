/*
 * DB
 */

var db;
var async = require('async');

exports.init = function(dbObj) {
	db = dbObj;
}

exports.home = function(req, res){
  var callback = function(results) { 
  	res.render('home.ejs', { 
	  title: 'Homepage',
	  groups: results
  });
  };
  db.getGroups(process.env.username, callback);
};  

exports.results = function(req, res){
  res.render('results.ejs', { 
	  title: 'Results' 
  });
};

exports.signup = function(req, res){
  res.render('signup.ejs', { 
	  title: 'SignUp' 
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
};

exports.group = function(req, res) {
	var groupID = req.query.groupID;
	db.getGroupMembers(groupID, function(members) {
		db.getGroupName(groupID, function(groupName) {
			res.render('group.ejs', {
				title: groupName,
				members: members
			});
		});
	});
};

/*
 * Create new user 
 */

exports.create_user = function(req, res){ 

	var callback = function(result) { 
		process.env.username = req.body.username;
		res.send("");  
	}; 

	db.createUser(req.body.username, req.body.password, req.body.address, 
		req.body.label, req.body.lat, req.body.lon, callback);

};   

exports.check_pass = function(req, res){ 

	var callback = function(err, result) { 
		if (err) 
			throw err; 
		else {
			if (result) {
				process.env.username = req.body.username;
				res.send("success"); 
			}
			else 
				res.send("failure");
		}   
	}; 

	db.validatePassword(req.body.username, req.body.password, callback);

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



