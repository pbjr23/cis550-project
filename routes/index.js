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

	// insert db.create.... 

	res.send("exists");

};  

/*
 * Searches for restaurants 
 */

exports.group_search = function(req, res){ 

	var callback = function(err, value) { 
		if (err) 
			throw err; 
		else 
			console.log(value); 
	}; 

	db.getRestsSquareCoords(req.body.minlat, req.body.minlong, req.body.maxlat, req.body.maxlong, callback);

}; 



