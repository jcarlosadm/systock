let database = require("./../../src/database");

let loggedUser = null;

function login(login, password, callback) {
    let connection = database.connectToStock();
    connection.execute(`select name,password from users where login = '${login}'`, 
    function(error, results, fields){
        if (error) throw error;
        if (checkResults(results) && results[0]['password'] === password) {
            loggedUser = {name:results[0]['name'], login:login};
        } else {
            loggedUser = null;
        }
        callback();
    });
}

function register(name, login, password, callback) {
    let connection = database.connectToStock();
    connection.execute(`select exists(select 1 from users where login = '${login}') as count`,
    function(error, results, fields){
        if (error) throw error;

        if (checkResults(results) && results[0]['count'] == 1) {
            callback("Usuário já existe");
        } else if (checkResults(results) && results[0]['count'] == 0) {
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

function checkResults(results) {
    return (results != null && results != undefined && results[0] != null &&
        results[0] != undefined);
}

function logout(callback) {
    loggedUser = null;
    callback();
}

function getLoggedUser() {
    return loggedUser;
}

module.exports = { login, register, logout, getLoggedUser };