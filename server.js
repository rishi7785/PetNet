// load express module
var express = require('express');

// create express server
var server = express ();

// Set public folder to be accessed by public user
server.use(express.static('public'));

// Port for server to run
var port = 3000;

// Load body parser module
var bodyParser = require ('body-parser');

// Set express to use body parser to pull from POST requests
server.use(bodyParser.urlencoded({extended: true}));

// Set express to parse raw JSON data if sent
server.use(bodyParser.json());

// Load the method override so express can know the HTTP method to use
var methodOverride = require('method-override');

// Let express know that we are overriding the HTTP method
server.use(methodOverride (function(request, response) {
    if (request.body) {
        if(typeof request.body == 'object') {
            if (request.body._method) {
                var method = request.body._method

                delete request.body._method;

                return method;
            }
        }
    }
}));

// Load in the express session handler
var session = require ('express-session');

// Configure the session to be used by express
server.use(session({
    secret: 'This is my secret phrase', // used to hash/encrypt the session key
    resave: false,
    saveUninitialized: true
}));

// Load in the connect-flash express middleware
var flash = require ('connect-flash');

// Set our server app to use the flash message object
server.use(flash());

server.use(function(request, response, next) {
    var user = request.session.user;
    if (user) {
        response.locals.user = user;

        if (user && user.type == 'admin') {
            user.admin = true;
        }
    }

    response.locals.message = request.flash();

    var contentType = request.headers['content-type'];
    request.contentType = contentType;

    console.log('***Content Type: ', contentType);

    if(request.contentType == 'application/json') {
        request.sendJson = true;
    }

    next();

});

// server.listen(port, function(error) {
//     if (error != undefined) {
//         console.error('***ERROR: Unable to start the server.');
//         console.error(error);
//     }
//     else {
//         console.log('- The server has successfully started on port: ' + port);
//     }
// });

// Configure the render engine handlebars.
var handlebars = require('express-handlebars');
server.engine('.hbs', handlebars ({
    layoutsDir: 'templates', // The directory of layout files.
    defaultLayout: 'index', // The base / main template to always load.
    extname: '.hbs'         // The file extension to use.
}));


// Default directory for express to use for handlebars templates
server.set ('views', __dirname + '/templates/partials');

server.set ('view engine', '.hbs');

// Bring in the Mongo DB client driver
var mongoClient = require('mongodb').MongoClient;

// Reference to the database
global.db;

// Connection to the database
mongoClient.connect ('mongodb://localhost:27017/PetNet', function(error, database) {
    if(error) {
        console.error('*** ERROR: Unable to connect to the mongo database.');
        console.error(error);
    }
    else {
        server.listen(port, function(error) {
            if (error !== undefined) {
                console.error('***ERROR: Unable to start server.');
                console.error(error);
            }
            else {
                db = database;

                console.log('- The server has successfully started on port: ' + port);
            }
        })
    }
});

// Load mongoose nodejs package
var mongoose = require('mongoose');

// Connect mongoose to mongodb server
mongoose.connect('mongodb://localhost:27017/PetNet');

// Set mongoose promise library to use
mongoose.promise = require('bluebird');




//-----------------------------------------------------------
// Basic url routes that the server can use
var basicRoutes = require('./routes/basic.js');

server.use('/', basicRoutes);

// Connect the user routes
var userRoutes = require ('./routes/user/user.js');

server.use ('/user', userRoutes);

var accessRoutes = require ('./routes/user/access.js');

server.use ('/', accessRoutes);
