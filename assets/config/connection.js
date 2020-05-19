const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

connection.connect(err => {
    if (err) {
        console.log(`Error connecting: ${err.stack}`)
        return;
    };

    console.log(`Connected by id ${connection.threadId}`)
});

module.exports = connection;