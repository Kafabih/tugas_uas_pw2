import mysql from 'mysql2';

const db = mysql.createConnection({
  host: '127.0.0.1',        // Change from 'localhost' to '127.0.0.1'
  user: 'fontana',
  password: '1sampai13',
  database: 'academic_app',
  port: 3306
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to MySQL');
  }
});

export default db;
