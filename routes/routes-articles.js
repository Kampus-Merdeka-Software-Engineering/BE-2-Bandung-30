const express = require('express');
const articles = express.Router();

const { prisma } = require('../config/database');

articles.get('/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;

    const result = await prisma.articles.findMany({
      where: {
        title: {
          contains: req.query.title || '',
        },
      },
      orderBy: {
        [req.query.sortBy || 'id']: req.query.sortOrder || 'asc',
      },
      skip: startIndex,
      take: pageSize,
    });

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

articles.get("/articles/id/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.articles.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!query) {
      res.status(404).send("Article not found");
    } else {
      res.status(200).send(query);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

articles.get("/articles/category/", async (req, res) => {
  try {
    const result = await prisma.articles.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        [req.query.sortBy || 'category']: req.query.sortOrder || 'asc',
      },
    });

    res.status(200).send(result.map(item => item.category));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


articles.get("/articles/subcategory/", async (req, res) => {
  try {
    const result = await prisma.articles.findMany({
      select: {
        subcategory: true,
      },
      distinct: ['subcategory'],
      orderBy: {
        [req.query.sortBy || 'subcategory']: req.query.sortOrder || 'asc',
      },
    });

    res.status(200).send(result.map(item => item.subcategory));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

articles.get("/articles/newest/", async (req, res) => {
  try {
    const result = await prisma.articles.findMany({
      orderBy: {
        publish_at: 'desc',
      },
      take: 5,
    });

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


articles.get("/articles/category/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;

    const result = await prisma.articles.findMany({
      where: {
        category: category,
      },
      orderBy: {
        [req.query.sortBy || 'id']: req.query.sortOrder || 'asc',
      },
      skip: startIndex,
      take: pageSize,
    });

    if (!result.length) {
      res.status(404).send("Articles in the specified category not found");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

articles.get("/articles/subcategory/:subcategory", async (req, res) => {
  const { subcategory } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;

    const result = await prisma.articles.findMany({
      where: {
        subcategory: subcategory,
      },
      orderBy: {
        [req.query.sortBy || 'id']: req.query.sortOrder || 'asc',
      },
      skip: startIndex,
      take: pageSize,
    });

    if (!result.length) {
      res.status(404).send("Articles in the specified subcategory not found");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error(error);
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
    <input type="text" name="source" placeholder="source" required /><br/>
    <input type="submit" value="what are you doing here?" />
    </form> `);
});

articles.post('/input/articles', async (req, res) => {
  const formData = req.body;

  const { username, password, publish_at: rawPublishAt, ...articleData } = formData;

  try {
    const adminQuery = await prisma.admin.findFirst({
      where: {
        username: formData.username,
        password: formData.password,
      },
    });

    if (adminQuery) {
      const publish_at = new Date(`${rawPublishAt}T00:00:00.000Z`);

      const query = await prisma.articles.create({
        data: {
          ...articleData,
          publish_at: publish_at,
        },
      });

      res.status(200).send('Data inserted successfully');
    } else {
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
    <input type="text" name="source" placeholder="source" required /><br/>
    <input type="hidden" name="_method" value="PUT">
    <input type="submit" value="what are you doing here?" />
    </form> `);
});

articles.put('/update/articles/', async (req, res) => {
  const formData = req.body;

  const { username, password, id, publish_at: rawPublishAt, ...articleData } = formData;

  try {
    const adminQuery = await prisma.admin.findFirst({
      where: {
        username: formData.username,
        password: formData.password,
      },
    });

    if (adminQuery) {
      const publish_at = new Date(`${rawPublishAt}T00:00:00.000Z`);
      const query = await prisma.articles.update({
        where: { id: parseInt(formData.id) },
        data: {
          ...articleData,
          publish_at: publish_at,
        }
      });

      res.status(200).send('Data updated successfully');
    } else {
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
    <input type="hidden" name="_method" value="DELETE">
    <input type="submit" value="what are you doing here?" />
    </form> `);
});

articles.delete('/delete/articles/', async (req, res) => {
  const formData = req.body;

  try {
    const adminQuery = await prisma.admin.findFirst({
      where: {
        username: formData.username,
        password: formData.password,
      },
    });

    if (adminQuery) {
      const query = await prisma.articles.delete({
        where: { id: parseInt(formData.id) },
      });

      res.status(200).send('Data deleted successfully');
    } else {
      res.status(403).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = articles;