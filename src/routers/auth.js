let express = require('express');
let router = express.Router();

let userController = require('./../../server/controller/user');

router.route('/login')
.get(redirectToHome, function(req, res) {
    res.render('./auth/login.ejs', { success: req.flash('success') });
    req.flash('success', null);
})
.post(redirectToHome,function(req, res){
    userController.login(req.body.login, req.body.password, function(user) {
        req.session.user = user;
        if (user != null) {
            res.redirect('/');
        } else {
            res.render('./auth/login.ejs', {
                error: 'erro na autenticação',
                success: req.flash('success')
            });
            req.flash('success', null);
        }
    });
});

router.get('/logout', function(req, res){
    req.session.user = null;
    res.redirect('/');
});

router.route('/register')
.get(redirectToHome,function(req, res) {
    res.render('./auth/register.ejs');
})
.post(redirectToHome,function(req, res) {
    userController.register(req.body.name, req.body.login, req.body.password, function(errorMsg) {
        if (errorMsg == null) {
            req.flash('success', 'sucesso ao registrar');
            res.redirect('/');
        } else {
            res.render('./auth/register.ejs', { error: errorMsg });
        }
    });
});

function redirectToHome(req, res, next) {
    if (req.session.user != null && req.session.user != undefined) {
        res.redirect('/');
    } else {
        next();
    }
}

function checkLogin(req, res, next) {
    if (req.session.user == null || req.session.user == undefined) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = { router, checkLogin };