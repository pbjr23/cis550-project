/**
 * Simple Homework 3 application for CIS 550
 * 
 * zives
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib") 
  , engine = require('ejs-locals')
  , bodyParser = require('body-parser')
  , testRoute = require("./routes/testRoute")
;

// Initialize express
var app = express();

// set the view engine to ejs
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

var db = require('./db.js');
var dbObj = new db();

routes.init(dbObj);
// .. and our app
init_app(app);

testRoute.init(dbObj);
app.get('/test', testRoute.testFunction);


// When we get a request for {app}/ we should call routes/index.js
app.get('/', routes.do_work);
app.post('/create_user', routes.create_user); 

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	app.set('views', __dirname + '/views');


	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}
