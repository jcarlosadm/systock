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

app.use(express.static('static'));

let auth = require('./src/routers/auth');

app.set('view engine', 'ejs');

app.use('/', auth.router);

app.get('/', auth.checkLogin, function(req,res){
    res.render('./index.ejs', {
        loggedUser: req.session.user,
        success: req.flash('success')
    });
    req.flash('success', null);
});

module.exports = app;