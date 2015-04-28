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
  , cookieParser = require('cookie-parser') 
  , session = require('express-session')
;

// Initialize express
var app = express();

// set the view engine to ejs
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use( express.static( path.join( __dirname, 'public' )));

app.use(cookieParser());
app.use(session({secret: 'yelpTeam'}));

var db = require('./db.js');
var dbObj = new db();

routes.init(dbObj);
// .. and our app
init_app(app);

//for testing
testRoute.init(dbObj);
app.get('/test', testRoute.testFunction);


// When we get a request for {app}/ we should call routes/index.js
app.get('/', routes.login); 
app.get('/login', routes.login); 
app.get('/results', routes.results); 
app.post('/check_username', routes.check_username);
app.post('/check_pass', routes.check_pass);
app.post('/get_fb_user_username', routes.get_fb_user_username);
app.post('/edit_pass', routes.edit_pass);
app.get('/home', routes.home);  
app.get('/signup', routes.signup);
app.post('/create_user', routes.create_user);  
app.post('/group_search', routes.group_search);
app.get('/user_profile', routes.user_profile);
app.get('/change_password', routes.change_password);
app.get('/change_name', routes.change_name);
app.get('/change_address', routes.change_address);
app.post('/address_to_lat_and_lon_tester', routes.address_to_lat_and_lon_tester);
app.post('/edit_address', routes.edit_address);
app.post('/edit_name', routes.edit_name);
app.get('/group', routes.group);
app.get('/create_group', routes.create_group);
app.post('/removeUserFromGroup', routes.removeUserFromGroup);
app.post('/addUserToGroup', routes.addUserToGroup);
app.get('/logout', routes.logout);


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
