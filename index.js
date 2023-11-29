require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');


const app = express();
const PORT = process.env.port || 3000;

// Setup MySQL connection
const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});


// pakai cors biar bisa share resource antar backend dan frontend
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
     res.json({'Server status': 'Online'});
});

app.get('/articles', (req, res) => {
    fs.readFile('./data/articles.json', (error, data) => {
        if (error) res.send('Gagal dalam pembacaan data');
        const products = JSON.parse(data);
        res.status(200).send(products);
    });
});

app.get('/data/articles', (req, res) => {
    const query = 'SELECT * FROM articles';
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send(result);
        }
    });
});

app.post('/submit-contactus', (req, res) => {
    const formData = req.body;

    const query = 'INSERT INTO form_contactus SET ?';
    db.query(query, formData, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted');
        res.status(200).send('Data inserted successfully');
      }
    });
  });

  app.post('/submit-formpengaduan', (req, res) => {
    const formData = req.body;

    if (!formData.phone || !formData.phone.startsWith('08')) {
    return res.status(400).send('Nomor telepon harus dimulai dengan "08"');
  }

    const query = 'INSERT INTO form_pengaduan SET ?';
    db.query(query, formData, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted');
        res.status(200).send('Data inserted successfully');
      }
    });
  });

app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log(
        `API URL http://localhost:${PORT} or api-revou.mrizkiw.com`
    );
});