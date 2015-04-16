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
  res.render('group_search.ejs', { 
	  title: 'Group Search' 
  });
}; 

exports.signup = function(req, res){
  res.render('signup.ejs', { 
	  title: 'SignUp' 
  });
};

/*
 * Create new user 
 */

exports.create_user = function(req, res){ 

	var callback = function(result) { 
		console.log(result); 
	}; 

	db.createUser(req.body.username, req.body.password, req.body.address, req.body.label, req.body.lat, req.body.lon, callback);

};  

/*
 * Searches for restaurants 
 */

exports.group_search = function(req, res){ 

	var callback = function(result) { 
			console.log(result); 
	}; 

	db.getRestsSquareCoords(req.body.minlat, req.body.minlong, req.body.maxlat, req.body.maxlong, callback);

}; 



