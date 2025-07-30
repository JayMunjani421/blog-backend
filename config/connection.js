require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE,
    // port: process.env.DB_PORT,
    host: mysql-3f928502-munjanijay421-29a8.j.aivencloud.com,
    user: avnadmin,
    password: AVNS_EX0iATLYqmjikFoOxRC,
    database: defaultdb,
    port: 12023,
    ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('C:\Users\DREAMWORLD\Downloads\ca.pem'),
  }
});

connection.connect(function (err){
    if(err){
        console.error('Error connecting to My?SQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID', connection.threadId);
});

module.exports = connection;
