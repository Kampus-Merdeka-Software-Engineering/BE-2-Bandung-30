require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectionPool } = require("./config/database");
const articles = require('./routes/routes-articles')

const app = express();
const PORT = process.env.port || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loggerMiddleware = (req, res, next) => {
  const now = new Date();
  const formattedTime = now.toLocaleDateString();
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  next();
};

app.use(loggerMiddleware);

app.get('/', function (req, res) {
  res.json({ 'Server status': 'Online' });
});

app.use('/data', articles);

app.post('/submit-contactus', async (req, res) => {
  const formData = req.body;

  formData.created_at = new Date();

  const connection = await connectionPool.getConnection();
  try {
    const [query] = await connection.query('INSERT INTO form_contactus SET ?', formData);
    res.status(200).send('Data inserted successfully');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    connection.release();
  }
});

app.post('/submit-formpengaduan', async (req, res) => {
  const formData = req.body;

  if (!/^[0-9]+$/.test(formData.phone) || !formData.phone.startsWith('08') || formData.phone.length < 10 || formData.phone.length > 15) {
    return res.status(400).send('Nomor telepon harus berupa angka dan dimulai dengan "08" serta minimal 10 angka dan tidak lebih dari 15 angka.');
  }

  formData.created_at = new Date();

  const connection = await connectionPool.getConnection();

  try {
    const [query] = await connection.query('INSERT INTO form_pengaduan SET ?', formData);
    res.status(200).send('Data inserted successfully');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    connection.release();
  }
});

app.all('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
});