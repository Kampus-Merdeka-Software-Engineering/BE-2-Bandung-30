const express = require('express');
const articles = express.Router();

const { connectionPool } = require('../config/database');

articles.get('/articles', async (req, res) => {

    const connection = await connectionPool.getConnection();
    try {
        const [query] = await connection.query('SELECT * FROM articles');
        res.status(200).send(query);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

});

articles.get("/articles/:id", async (req, res) => {
    const { id } = req.params;

    const connection = await connectionPool.getConnection();
    try {
        const [query] = await connection.query('SELECT * FROM articles WHERE id = ?', [id]);
        console.log(query);
        if (!query.length) {
            res.status(404).send("Articles not found");
        } else {
            res.status(200).send(query);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

articles.get("/articles/category/:category", async (req, res) => {
    const { category } = req.params;

    const connection = await connectionPool.getConnection();
    try {
        const [query] = await connection.query('SELECT * FROM articles WHERE category = ?', [category]);
        console.log(query);
        if (!query.length) {
            res.status(404).send("Articles not found");
        } else {
            res.status(200).send(query);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

articles.get('/input/articles/', async (req, res) => {
    res.send(`
    <form method="post" action="/data/input/articles/">
    <input type="text" name="username" placeholder="username" required /><br/>
    <input type="password" name="password" placeholder="password" required /><br/><br/>
    <input type="text" name="title" placeholder="title" required /><br/>
    <input type="text" name="desc" placeholder="desc" required /><br/>
    <input type="text" name="category" placeholder="category" required /><br/>
    <input type="text" name="subcategory" placeholder="subcategory" required /><br/>
    <input type="text" name="img_url" placeholder="img_url" required /><br/>
    <input type="date" name="publish_at" placeholder="publish_at" required /><br/>
    <input type="submit" value="what are you doing here?" />
    </form> `);
});

articles.post('/data/input/articles/', async (req, res) => {
    const formData = req.body;

    const { username, password, ...articleData } = formData;

    const connection = await connectionPool.getConnection();
    try {
        const [adminQuery] = await connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [formData.username, formData.password]);

        if (adminQuery.length > 0) {
            // Jika admin valid
            const [query] = await connection.query('INSERT INTO articles SET ?', articleData);
            console.log("Ada yang menambahkan artikel.");
            res.status(200).send('Data inserted successfully');
        } else {
            console.log("Invalid credentials");
            res.status(403).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

articles.get('/update/articles/', async (req, res) => {
    res.send(`
    <form method="POST" action="/data/update/articles/">
    <input type="text" name="username" placeholder="username" required /><br/>
    <input type="password" name="password" placeholder="password" required /><br/><br/>
    <input type="tel" name="id" placeholder="id" required /><br/>
    <input type="text" name="title" placeholder="title" required /><br/>
    <input type="text" name="desc" placeholder="desc" required /><br/>
    <input type="text" name="category" placeholder="category" required /><br/>
    <input type="text" name="subcategory" placeholder="subcategory" required /><br/>
    <input type="text" name="img_url" placeholder="img_url" required /><br/>
    <input type="date" name="publish_at" placeholder="publish_at" required /><br/>
    <input type="submit" value="what are you doing here?" />
    </form> `);
});

articles.put('/update/articles/', async (req, res) => {
    const formData = req.body;

    const { username, password, id, ...articleData } = formData;

    const connection = await connectionPool.getConnection();
    try {
        const [adminQuery] = await connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [formData.username, formData.password]);

        if (adminQuery.length > 0) {
            // Jika admin valid
            const [query] = await connection.query('UPDATE articles SET ? WHERE id = ?', [articleData, formData.id]);
            console.log("Ada yang mengubah artikel.");
            res.status(200).send('Data updated successfully');
        } else {
            console.log("Invalid credentials");
            res.status(403).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

articles.post('/update/articles/', async (req, res) => {
    const formData = req.body;

    const { username, password, id, ...articleData } = formData;

    const connection = await connectionPool.getConnection();
    try {
        const [adminQuery] = await connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [formData.username, formData.password]);

        if (adminQuery.length > 0) {
            // Jika admin valid
            const [query] = await connection.query('UPDATE articles SET ? WHERE id = ?', [articleData, formData.id]);
            console.log("Ada yang mengubah artikel.");
            res.status(200).send('Data updated successfully');
        } else {
            console.log("Invalid credentials");
            res.status(403).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

articles.get('/delete/articles/', async (req, res) => {
    res.send(`
    <form method="POST" action="/data/delete/articles/">
    <input type="text" name="username" placeholder="username" required /><br/>
    <input type="password" name="password" placeholder="password" required /><br/><br/>
    <input type="tel" name="id" placeholder="id" required /><br/>
    <input type="submit" value="what are you doing here?" />
    </form> `);
});

articles.delete('/delete/articles/', async (req, res) => {
    const formData = req.body;

    const connection = await connectionPool.getConnection();
    try {
        const [adminQuery] = await connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [formData.username, formData.password]);

        if (adminQuery.length > 0) {
            // Jika admin valid
            const [query] = await connection.query('DELETE FROM articles WHERE id = ?', formData.id);
            console.log("Ada yang menghapus artikel.");
            res.status(200).send('Data deleted successfully');
        } else {
            console.log("Invalid credentials");
            res.status(403).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

articles.post('/delete/articles/', async (req, res) => {
    const formData = req.body;

    const connection = await connectionPool.getConnection();
    try {
        const [adminQuery] = await connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [formData.username, formData.password]);

        if (adminQuery.length > 0) {
            // Jika admin valid
            const [query] = await connection.query('DELETE FROM articles WHERE id = ?', formData.id);
            console.log("Ada yang menghapus artikel.");
            res.status(200).send('Data deleted successfully');
        } else {
            console.log("Invalid credentials");
            res.status(403).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = articles;
