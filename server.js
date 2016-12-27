// load express module
var express = require('express');

// create express server
var server = express ();

// Set public folder to be accessed by public user
server.use(express.static('public'));

// Port for server to run
var port = 3000;

server.listen(port, function(error) {
    if (error != undefined) {
        console.error('***ERROR: Unable to start the server.');
        console.error(error);
    }
    else {
        console.log('- The server has successfully started on port: ' + port);
    }
});

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

//-----------------------------------------------------------
// Basic url routes that the server can use
var basicRoutes = require('./routes/basic.js');

server.use('/', basicRoutes);
