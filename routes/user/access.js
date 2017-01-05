var express = require ('express');
var router = express.Router ();

var User = require ('../../model/user.js');

router.get('register', function(request, response) {
    response.render('user/register', {
        data: {
            title: "Register"
        }
    })
});
router.post ('/register', function(request,response) {
    var newUser = User ({
        username: request.body.username,
        password: request.body.password,
        admin: request.body.admin
    });

    newUser.save(function (error) {
        if (error) {
            console.error('**** not able to save user');
            console.error(error);
        }
        else {
            console.log('user saved', request.body.username);
            response.redirect('/login')
        }
    });
});

router.get('/login', function(request,response) {
    if (request.session.user) {
        console.log('this is the sessions data: ', request.session);
        response.redirect('/')
    }
    else {
        response.render ('user/login')
    }
});

router.post ('/login', function (request, response) {
    User.findOne (request.body,function (error,result){
        if (error) {
            console.log('CAnt find the User');
            console.log(error);
        }
        else if (!result) {
            request.flash ('error', 'Your username and password did not match');
            response.redirect ('/login');
        }
        else {
            console.log('found the user');
            request.session.user = result
            console.log('this is the session data', request.session);
            response.redirect ('/');
            //NOTE: redirect to a profile page.
        }
    })
})
// NOTE: this destroys the session
router.get ('/logout', function (request, response) {
    request.session.destroy ();
    console.log('session destroyed', request.session);
    response.redirect ('/login')
})

module.exports = router;
