const express = require('express');
let books = require("./booksdb.js");
const { JsonWebTokenError } = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ 'username': username, 'password': password });
            return res.status(200).json({ message: 'Login Successful!' });
        } else {
            return res.status(404).json({ message: 'Unable with same username already exists!' });
        }
    }
    return res.status(404).json({ message: 'Unable to register User' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    try {
        const response = await axios.get('http://localhost:5000/');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Unable to retrieve books' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    try {
        const response = await axios.get('http://localhost:5000/');
        const books = response.data.books;
        const isbn = req.params.isbn;

        if (books[isbn]) {
            res.json(books[isbn]);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Unable to retrieve books' });
    }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    try {
        const response = await axios.get('http://localhost:5000/');
        const books = response.data.books;

        let booksByAuthor = [];

        Object.keys(books).forEach((isbn) => {
            if (books[isbn].author === req.params.author) {
                booksByAuthor.push({
                    isbn: isbn,
                    title: books[isbn].title,
                    reviews: books[isbn].reviews
                });
            }
        });

        res.json({ booksByAuthor });

    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    try {
        const response = await axios.get('http://localhost:5000/');
        const books = response.data.books;

        let booksByTitle = [];

        Object.keys(books).forEach((isbn) => {
            if (books[isbn].title === req.params.title) {
                booksByTitle.push({
                    isbn: isbn,
                    title: books[isbn].title,
                    author: books[isbn].author,
                    reviews: books[isbn].reviews
                });
            }
        });

        res.json({ booksByTitle });

    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;
