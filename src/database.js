var mysql = require('mysql2');
var fs = require('fs');
var path = require('path');

function bufferFile(relPath) {
    return fs.readFileSync(path.join(__dirname, relPath));
}

let data = JSON.parse(bufferFile('../config/mysql_user.json'));

function connectToStock() {
  return mysql.createConnection({
    host: "localhost",
    user: data.user,
    password: data.password,
    database: "stock"
  });
}

function checkResults(results) {
  return (results != null && results != undefined && results[0] != null &&
      results[0] != undefined);
}

module.exports = { connectToStock, checkResults };