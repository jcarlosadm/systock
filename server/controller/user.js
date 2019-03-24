let db = require("./../../src/database");

function login(login, password, callback) {
    let connection = db.connectToStock();
    connection.execute(`select name,password from users where login = '${login}'`, 
    function(error, results, fields){
        if (error) throw error;
        if (db.checkResults(results) && results[0]['password'] === password) {
            callback({name:results[0]['name'], login:login});
        } else {
            callback(null);
        }
    });
}

function register(name, login, password, callback) {
    let connection = db.connectToStock();
    connection.execute(`select exists(select 1 from users where login = '${login}') as count`,
    function(error, results, fields){
        if (error) throw error;

        if (db.checkResults(results) && results[0]['count'] == 1) {
            callback("Usuário já existe");
        } else if (db.checkResults(results) && results[0]['count'] == 0) {
            connection.execute(`insert into users(name, login , password) 
            values ('${name}','${login}','${password}')`, function(error, results, fields){
                if (error) throw error;
                callback(null);
            });
        } else {
            throw new Error("error in mysql query");
        }
    });
}

module.exports = { login, register };