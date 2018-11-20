var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Saami94!@",
  database:'upcomingg_dev2'
});

con.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
module.exports = con;