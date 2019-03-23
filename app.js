let bodyParser = require('body-parser');
let express = require('express');
let app = express();
var session = require('express-session');
var flash = require('req-flash');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
    resave: false,
    saveUninitialized: true
    }));
app.use(flash());

let userController = require('./server/controller/user');


app.set('view engine', 'ejs');

app.get('/',function(req,res){
    if (userController.getLoggedUser() == null) {
        res.redirect('/login');
    } else {
        res.render('./index.ejs', {
            loggedUser: userController.getLoggedUser(),
            success: req.flash('success')
        });
        req.flash('success', null);
    }
});

app.get('/login', function(req, res) {
    res.render('./auth/login.ejs', { success: req.flash('success') });
    req.flash('success', null);
});

app.post('/login', function(req, res){
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

app.get('/logout', function(req, res){
    userController.logout(function() {
        res.redirect('/');
    });
});

app.get('/register', function(req, res) {
    res.render('./auth/register.ejs');
});

app.post('/register', function(req, res) {
    userController.register(req.body.name, req.body.login, req.body.password, function(errorMsg) {
        if (errorMsg == null) {
            req.flash('success', 'sucesso ao registrar');
            res.redirect('/');
        } else {
            res.render('./auth/register.ejs', { error: errorMsg });
        }
    });
});

module.exports = app;