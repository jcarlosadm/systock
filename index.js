require('./config/database.js');
var app = require('./app.js')
app.listen(3000,function(){
    console.log("App iniciado!!")
})