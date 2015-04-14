
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , wall= require('./routes/wall')
  , http = require('http')
  , path = require('path')
  ,session = require('express-session')

var app = express();

app.use(express.cookieParser());   
app.use(express.session({resave: false,
	  saveUninitialized: true,secret:'adfasdf34etydfs34sefsdf'}));
app.use(function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/signup', user.signup);
app.post('/signin', user.signin);
app.get('/wall', user.view);
app.get('/wall/getwall', user.getwall);
app.get('/user/profile', user.profile);
app.get('/user/edit', user.editprofile);
app.post('/profile/editsummary', user.editsummary)
app.post('/profile/editexp', user.editexp)
app.post('/profile/addexp', user.addexp)
app.post('/profile/editexpid', user.editexpid)
app.post('/profile/delexp', user.delexp)

app.post('/profile/search', user.search)
app.get('/profile/search', user.getall)

app.get('/connections', user.getallconnections)

app.post('/sendinvitation', user.sendinvitations)
app.get('/getinvitationstatus', user.getinvitationstatus)
app.get('/invitation/box', user.box)
app.get('/signout', user.signout)
app.post('/invitation/accept', user.acceptinvitation)
app.get('/failure', user.failure)
app.post('/skill/addskill', user.addskill)
app.post('/skill/delskill', user.delskill)




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
