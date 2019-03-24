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

let userController = require('./server/controller/user');
let authRouter = require('./src/routers/auth');

app.set('view engine', 'ejs');

app.use('/', authRouter);

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

module.exports = app;