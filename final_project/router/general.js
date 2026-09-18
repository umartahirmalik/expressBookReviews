const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});


// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});


// Get book based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// Get books based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    const result = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author) {
            result[isbn] = books[isbn];
        }
    });

    return res.status(200).json(result);
});


// Get books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    const result = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title) {
            result[isbn] = books[isbn];
        }
    });

    return res.status(200).json(result);
});


// Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(books[isbn].reviews);
});


// ====================================================
// Promise / Async-Await / Axios implementation
// Required for Tasks 10-13
// ====================================================

const BASE_URL = "http://localhost:5000";


// Get all books using Promise
function getAllBooks() {
    return axios
        .get(`${BASE_URL}/`)
        .then((response) => response.data);
}


// Get book by ISBN using async/await
async function getBookByISBN(isbn) {
    const response = await axios.get(
        `${BASE_URL}/isbn/${isbn}`
    );

    return response.data;
}


// Get books by author using async/await
async function getBooksByAuthor(author) {
    const response = await axios.get(
        `${BASE_URL}/author/${encodeURIComponent(author)}`
    );

    return response.data;
}


// Get books by title using async/await
async function getBooksByTitle(title) {
    const response = await axios.get(
        `${BASE_URL}/title/${encodeURIComponent(title)}`
    );

    return response.data;
}


module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
