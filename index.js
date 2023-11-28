require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require("fs");


const app = express();
const PORT = 3000;

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

// handle request di main routes ("/")
app.get("/", function (request, response) {
	// aku gamau baca detail requestnya aku mau langsung
	// kirim response aja
	response.send("Aku balikin sebuah RESPONz");
});

// dari rute ini harapannya bisa mengirimkan data produk ke yang request data product
app.get("/articles", (req, res) => {
	// nanti proses logicnya itu ngambil data dulu dari database, lalu dikirim melaluli response, saat ini kita bakal pake data dari json dulu/fake data

	// ambil data json dari /data/products.json
	fs.readFile("./data/articles.json", (error, data) => {
		if (error) res.send("Gagal dalam pembacaan data");
		const products = JSON.parse(data);
		res.status(200).send(products);
	});
});

app.get('/data/articles', (req, res) => {
    // Ambil data dari tabel
    const query = 'SELECT * FROM articles';
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        // Kirim data ke halaman baru
        res.status(200).send(result);
      }
    });
  });
  

// tangkap semua request/permintaan ke rute yang tidak dikenal
app.all("*", (req, res) => {
	res.status(404).send("404 routes not found");
});

app.listen(PORT, () => {
	console.log(
		`iya appnya udah nyala nih, cek aja di url: http://localhost:${PORT}`
	);
});