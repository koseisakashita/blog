var express = require('express'),
	app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var connect        = require('connect');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');

var post = require('./routes/post');

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// CSRF対策
app.use(cookieParser());
app.use(session({secret: 'uwotm8'}));
app.use(csrf());
app.use(function(req, res, next){
	res.locals.csrftoken =req.csrfToken();
	next();
});


app.use(logger('dev'));

// routing
app.get('/', post.index);
app.get('/posts/:id([0-9]+)', post.show);
app.get('/posts/new', post.new);
app.post('/posts/create', post.create);
app.get('/posts/:id/edit', post.edit);
app.put('/posts/:id', post.update);
app.delete('/posts/:id', post.destroy);

app.listen(3003);
console.log('server starting...');