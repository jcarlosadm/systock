var mysql = require('mysql2');
var fs = require('fs');
var path = require('path');

var BUFFER = bufferFile('mysql_user.json');

function bufferFile(relPath) {
    return fs.readFileSync(path.join(__dirname, relPath));
}

var parsed = JSON.parse(BUFFER.toString());

var con = mysql.createConnection({
  host: "localhost",
  user: parsed.user,
  password: parsed.password
});

con.query("CREATE DATABASE IF NOT EXISTS stock",
  function (err) {
    if (err) throw err;
    console.log("Database created");
  }  
);

var con = mysql.createConnection({
  host: "localhost",
  user: parsed.user,
  password: parsed.password,
  database: "stock"
});

con.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), login VARCHAR(255), password VARCHAR(255))",
  function (err, result) {
    if (err) throw err;
    console.log("Users Table created");
  }
);