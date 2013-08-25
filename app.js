/**
 * Module dependencies.
 */
var http = require('http')
    , path = require('path')
    , express = require('express')
    , hbs = require('express-hbs')
    , routes = require('./routes')
;

// Create app
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

// Setup Handlebars views
app.engine('hbs', hbs.express3({
    defaultLayout: __dirname + '/views/layout/default',
    partialsDir: __dirname + '/views/partials',
    contentHelperName: 'content'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

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
app.get('/channel', routes.channel);
app.get('/callout', routes.callout);
app.post('/callout', routes.callout);
app.get('/redemption/:id/:redeemer?', routes.redemption);
app.get('/paypal/execute/:id/:redeemer?', routes.paypal.execute);
app.post('/paypal/:id', routes.paypal.create);

// Create HTTP server
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
