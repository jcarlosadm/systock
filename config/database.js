var mysql = require('mysql2');
var fs = require('fs');
var path = require('path');

function bufferFile(relPath) {
    return fs.readFileSync(path.join(__dirname, relPath));
}

var data = JSON.parse(bufferFile('mysql_user.json'));

function connect(data) {
  return mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password
  });
}

function createDB(connection, callback) {
  connection.query("CREATE DATABASE IF NOT EXISTS stock",
  function (err) {
    if (err) throw err;
    console.log("Database created");
    callback();
  }  
);
}

function connectToStock(data) {
  return mysql.createConnection({
    host: data.host,
    user: data.user,
    password: data.password,
    database: "stock"
  });
}

function createTable(connection, callback) {
  connection.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), login VARCHAR(255), password VARCHAR(255))",
  function (err, result) {
    if (err) throw err;
    console.log("Users Table created");
    callback();
  }
  );
}

function run() {
  createDB(connect(data), function() {
    createTable(connectToStock(data), function(){});
  });
}

run();