# Spill Detik Backend (Group 30)

## Description
This project serves as the backend for a news portal website, in this case, [Spill Detik](https://kampus-merdeka-software-engineering.github.io/FE-2-Bandung-30/index.html). The application is built using Express.js and employs the Prisma ORM for interaction with a MySQL database. The application displays data retrieved from the database and also includes all CRUD operations.

## Installation
Users should clone this repository from GitHub. The application requires Node.js, Express.js, and Prisma. Fill in the necessary elements in the .env file, referring to the .env.example file for guidance. To run the server, execute `npx prisma generate` and `npx prisma migrate dev`. After that, you can start the server with `npm run start`.

## Main URL
* https://api-revou.mrizkiw.com/

## Endpoint
<details>
<summary>Status API</summary>

* Endpoint  : /
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
none
```
* Response :
```
{
    "serverStatus": "Online",
    "dbMethod": "ORM by Prisma"
}
```
</details>

<details>
<summary>GET Data Articles From Database</summary>

* Endpoint  : /data/articles
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
title
category
subcategory
page
pageSize
sortBy
sortOrder
```
* Response :
```
[
    {
        "id": int,
        "title": String,
        "desc": String,
        "category": String,
        "subcategory": String,
        "img_url": String,
        "publish_at": String,
        "source": String
    }
]
```
</details>

<details>
<summary>GET Data Articles by id From Database</summary>

* Endpoint  : /data/articles/:id
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
id (required)
```
* Response :
```
[
    {
        "id": int,
        "title": String,
        "desc": String,
        "category": String,
        "subcategory": String,
        "img_url": String,
        "publish_at": String,
        "source": String
    }
]
```
</details>
<details>
<summary>GET Data Articles Category From Database</summary>

* Endpoint  : /data/articles/category
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
sortBy
sortOrder
```
* Response :
```
[
    "Ekonomi",
    "Hiburan",
    "Lifestyle",
    "Olahraga",
    "Otomotif",
    "Politik",
    "Teknologi"
]
```
</details>
<details>
<summary>GET Data Articles Subcategory From Database</summary>

* Endpoint  : /data/articles/subcategory
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
sortBy
sortOrder
```
* Response :
```
[
    "Badminton",
    "Bisnis",
    "Energi",
    "Film",
    "Food",
    "Health",
    "Hukum Kriminal",
    "Info politik",
    "Keuangan",
    "Mobil",
    "Motor",
    "Motor GP",
    "Musik",
    "Peristiwa",
    "Sains",
    "Selebriti",
    "Sepakbola",
    "Teknologi Informasi",
    "Telekomunikasi",
    "Travel",
    "Tren"
]
```
</details>
<details>
<summary> GET Data Newest Articles From Database</summary>

* Endpoint  : /data/articles/newest
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
none
```
* Response :
```
[
    {
        "id": int,
        "title": String,
        "desc": String,
        "category": String,
        "subcategory": String,
        "img_url": String,
        "publish_at": String,
        "source": String
    }
]
```
</details>

<details>
<summary> GET Data Articles by Category From Database</summary>

* Endpoint  : /data/articles/category/:category
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
category (required)
sortBy
sortOrder
```
* Response :
```
[
    {
        "id": int,
        "title": String,
        "desc": String,
        "category": String,
        "subcategory": String,
        "img_url": String,
        "publish_at": String,
        "source": String
    }
]
```
</details>

<details>
<summary> GET Data Articles by Subcategory From Database</summary>

* Endpoint  : /data/articles/subcategory/:subcategory
* Method    : GET
* Request Body :
```
none
```
* Request Params :
```
subcategory (required)
sortBy
sortOrder
```
* Response :
```
[
    {
        "id": int,
        "title": String,
        "desc": String,
        "category": String,
        "subcategory": String,
        "img_url": String,
        "publish_at": String,
        "source": String
    }
]
```
</details>
<details>
<summary> POST Data Articles in Database</summary>

* Endpoint  : /data/input/articles
* Method    : POST
* Request Body :
```
{
    "username": String,
    "password": String,
    "title": String,
    "desc": String,
    "category": String,
    "subcategory": String,
    "img_url": String,
    "publish_at": Date,
    "source": String
}
```
* Request Params :
```
none
```
* Response (200) :
```
Data inserted successfully
```
* Response (403) :
```
Invalid credentials
```
</details>
<details>

<summary> PUT Data Articles in Database</summary>

* Endpoint  : /data/update/articles
* Method    : PUT
* Request Body :
```
{
    "username": String,
    "password": String,
    "id": int,
    "title": String,
    "desc": String,
    "category": String,
    "subcategory": String,
    "img_url": String,
    "publish_at": Date,
    "source": String
}
```
* Request Params :
```
none
```
* Response (200) :
```
Data updated successfully
```
* Response (403) :
```
Invalid credentials
```
</details>
<details>

<summary> DELETE Data Articles in Database</summary>

* Endpoint  : /data/delete/articles
* Method    : DELETE
* Request Body :
```
{
    "username": String,
    "password": String,
    "id": int
}
```
* Request Params :
```
none
```
* Response (200) :
```
Data deleted successfully
```
* Response (403) :
```
Invalid credentials
```
</details>
<details>

<summary> POST Data Form Contact Us to Database</summary>

* Endpoint  : /submit-contactus
* Method    : POST
* Request Body :
```
{
    "namalengkap": String,
    "email": String,
    "subject": String
}
```
* Request Params :
```
none
```
* Response (200) :
```
Data inserted successfully
```
</details>
<details>

<summary> POST Data Form Pengaduan to Database</summary>

* Endpoint  : /submit-formpengaduan
* Method    : POST
* Request Body :
```
{
    "email": String,
    "nama": String,
    "phone": String,
    "location": String,
    "date": Date,
    "complaint": String,
    "outcome": String
}
```
* Request Params :
```
none
```
* Response (200) :
```
Data inserted successfully
```
* Response (400) :
```
Nomor telepon harus berupa angka dan dimulai dengan "08" serta minimal 10 angka dan tidak lebih dari 15 angka.
```
</details>
