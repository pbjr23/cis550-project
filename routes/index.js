/*
 * DB
 */

var db;
var async = require('async');

exports.init = function(dbObj) {
	db = dbObj;
}

/*
 * GET home page, which is specified in EJS.
 */

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

exports.groups = function(req, res){
  var groups = [];
  var callback = function(results) { 
  	groups = results;
  };
  db.getGroups("test6", callback);
  res.render('groups.ejs', { 
	  title: 'Groups',
	  groups: groups 
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

	db.createUser(req.body.username, req.body.password, req.body.address, req.body.label, req.body.lat, req.body.lon, callback);

};   

exports.check_pass = function(req, res){ 

	var callback = function(result) { 
		var json = result[0]; 
		var password = json.PASS; 
		if (req.body.password === password) {
			process.env.username = req.body.username;
			res.send("success"); 
		}
		else 
			res.send("failure");   
	}; 

	db.getPassword(req.body.username, callback);

};  

/*
 * Searches for restaurants 
 */

exports.group_search = function(req, res){ 

	var callback = function(result) { 
		res.send(result);  
	}; 

	db.getRestsSquareCoords(req.body.minlat, req.body.minlong, req.body.maxlat, req.body.maxlong, callback);

}; 



