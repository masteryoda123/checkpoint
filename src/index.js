var express = require('express');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var routes = require('./routes');

var app = express();
var portNum = process.env.PORT || 8080;



// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

// app.use(session({
//     secret: 'secret',
//     saveUnitialized: true,
//     resave: true
// }));

// PASSPORT
// app.use(passport.initialize());
// app.use(passport.session());

// Flash
app.use(flash());


// Views
app.use('/static', express.static(__dirname + '/../static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');






// routes
app.use('/', routes);



app.listen(portNum, function() {
    if (!process.env.PORT) {
        console.log('Serving port number ' + portNum);
    }
});
