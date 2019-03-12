var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123"
});

con.query("CREATE DATABASE IF NOT EXISTS stock",
  function (err) {
    if (err) throw err;
    console.log("Database created");
  }  
);

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "stock"
});

con.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), login VARCHAR(255), password VARCHAR(255))",
  function (err, result) {
    if (err) throw err;
    console.log("Users Table created");
  }
);