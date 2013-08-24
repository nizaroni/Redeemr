/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var hbs = require('express-hbs');

// Create app
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

// Setup Handlebars views
app.engine('hbs', hbs.express3({
  defaultLayout: __dirname + '/layouts/layout.html',
  partialsDir: __dirname + '/views/partials',
  contentHelperName: 'partial',
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only settings
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// App routes
app.get('/', routes.index);

// Create HTTP server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
