// Connect string to Oracle
var connectData = { 
  "hostname": "cis550hw1.cfoish237b6z.us-west-2.rds.amazonaws.com", 
  "user": "cis550students", 
  "password": "cis550hw1", 
  "database": "IMDB" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_directors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute(
	  			"with Direct AS ("
	  			+ "SELECT * FROM directors D "
	  			+ "INNER JOIN movies_directors MD on MD.director_id = D.id "
	  			+ "INNER JOIN movies M on M.id = MD.movie_id "
	  			+ "WHERE last_name='" + name + "') "
	  			+ "SELECT * FROM ("
	  			+ "SELECT * FROM Direct D ORDER BY D.rank DESC"
	  			+ ") WHERE ROWNUM <= 5",
	  			[], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_actors(res, name, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_actors(res,name,results) {
	res.render('director.jade',
		   { title: "Director with last name " + name + " and top rated movies",
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res,req.query.name);
};
