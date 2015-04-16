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

exports.do_work = function(req, res){
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



