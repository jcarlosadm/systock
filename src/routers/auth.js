let express = require('express');
let router = express.Router();

let userController = require('./../../server/controller/user');

router.route('/login')
.get(function(req, res) {
    res.render('./auth/login.ejs', { success: req.flash('success') });
    req.flash('success', null);
})
.post(function(req, res){
    userController.login(req.body.login, req.body.password, function() {
        if (userController.getLoggedUser() != null) {
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
    userController.logout(function() {
        res.redirect('/');
    });
});

router.route('/register')
.get(function(req, res) {
    res.render('./auth/register.ejs');
})
.post(function(req, res) {
    userController.register(req.body.name, req.body.login, req.body.password, function(errorMsg) {
        if (errorMsg == null) {
            req.flash('success', 'sucesso ao registrar');
            res.redirect('/');
        } else {
            res.render('./auth/register.ejs', { error: errorMsg });
        }
    });
});

function checkLogin(req, res, next) {
    if (userController.getLoggedUser() == null) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = { router, checkLogin };