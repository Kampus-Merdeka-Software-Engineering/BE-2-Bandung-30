const express = require('express');
const articles = express.Router();

const { connectionPool } = require('../config/database');

articles.get('/articles', async (req, res) => {

    const connection = await connectionPool.getConnection();
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const startIndex = (page - 1) * pageSize;

        let query = `SELECT * FROM articles`;

        // let query = 'SELECT * FROM articles';

        if (req.query.title) {
            query += ` WHERE title LIKE '%${req.query.title}%'`;
        }

        if (req.query.sortBy) {
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || 'ASC';

            query += ` ORDER BY ${sortBy} ${sortOrder}`;
        }

        query += ` LIMIT ${startIndex}, ${pageSize}`;

        const [result] = await connection.query(query);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

articles.get("/articles/id/:id", async (req, res) => {
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
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

articles.get("/articles/category/", async (req, res) => {
    const connection = await connectionPool.getConnection();

    try {
        let query = `SELECT DISTINCT category FROM articles`;
        if (req.query.sortBy) {
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || 'ASC';

            query += ` ORDER BY ${sortBy} ${sortOrder}`;
        }

        const [result] = await connection.query(query);

        res.status(200).send(result.map(item => item.category));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

articles.get("/articles/subcategory/", async (req, res) => {
    const connection = await connectionPool.getConnection();

    try {
        let query = `SELECT DISTINCT subcategory FROM articles`;
        if (req.query.sortBy) {
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || 'ASC';

            query += ` ORDER BY ${sortBy} ${sortOrder}`;
        }

        const [result] = await connection.query(query);
        res.status(200).send(result.map(item => item.subcategory));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

articles.get("/articles/newest/", async (req, res) => {
    const connection = await connectionPool.getConnection();

    try {
        const [result] = await connection.query('SELECT * FROM articles ORDER BY publish_at DESC LIMIT 5');
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

articles.get("/articles/category/:category", async (req, res) => {

    const connection = await connectionPool.getConnection();
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const startIndex = (page - 1) * pageSize;

        let query = 'SELECT * FROM articles';

        if (req.params.category) {
            const category = req.params.category;
            query += ` WHERE category = '${category}'`;
            // query += ` AND title LIKE '%${category}%'`;
        }

        if (req.query.sortBy) {
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || 'ASC';

            query += ` ORDER BY ${sortBy} ${sortOrder}`;
        }

        query += ` LIMIT ${startIndex}, ${pageSize}`;

        const [result] = await connection.query(query);

        if (!query.length) {
            res.status(404).send("Category not found");
        } else {
            res.status(200).send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

articles.get("/articles/subcategory/:subcategory", async (req, res) => {

    const connection = await connectionPool.getConnection();
    try {

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const startIndex = (page - 1) * pageSize;

        let query = 'SELECT * FROM articles';

        if (req.params.subcategory) {
            const subcategory = req.params.subcategory;
            query += ` WHERE subcategory = '${subcategory}'`;
            // query += ` AND title LIKE '%${subcategory}%'`;
        }

        if (req.query.sortBy) {
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || 'ASC';

            query += ` ORDER BY ${sortBy} ${sortOrder}`;
        }

        query += ` LIMIT ${startIndex}, ${pageSize}`;

        const [result] = await connection.query(query);

        if (!query.length) {
            res.status(404).send("Subcategory not found");
        } else {
            res.status(200).send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
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

articles.post('/input/articles/', async (req, res) => {
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
    } finally {
        connection.release();
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
    } finally {
        connection.release();
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
    } finally {
        connection.release();
    }
});

module.exports = articles;
