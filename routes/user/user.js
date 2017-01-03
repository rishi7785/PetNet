var express = require ('express');
var router = express.Router ();
var User = require ('../../model/user.js');

router.get('/create', function(request,response) {
    response.send('You hit the create route.')
})
