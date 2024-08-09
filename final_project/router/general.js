const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            return res.status(200).json({message: "User already registered"});
        } else {
            users.push({"username": req.body.username, "password": req.body.password});
            return res.status(404).json({message: "User registered"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const bookstitles = await new Promise((resolve, reject) => {
        const titles = Object.keys(books).map(key => books[key].title);
        resolve(JSON.stringify(titles))
    })

    return res.status(200).json({bookstitles});
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//
//     let isbn = req.params['isbn']
//
//     const booksend = books[isbn]
//
//     booksend ? res.status(200).json({book: booksend}) : res.status(404).json({message: "Not Found"});
// });
public_users.get('/isbn/:isbn', async function (req, res) {

    const GetisbnBook = await new Promise((resolve, reject) => {
        let isbn = req.params['isbn']

        const booksend = books[isbn]
        resolve(booksend)
    })
        .then(book => {
            res.status(200).json({book: book});
        })
        .catch(err => res.status(404).json({message: "Not Found err:" + err})
        );
});
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    const getauthorboook = await new Promise((resolve, reject) => {
        let author = req.params['author']

        const booksend = Object.keys(books).map(key => books[key]).filter((book) => book.author === author);
        resolve(booksend)
    })

        .then(value => {
            res.status(200).json({book: value})
        }).catch(err => res.status(404).json({message: "Not Found err:" + err})
        )
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const gettitlebook = await new Promise((resolve, reject) => {
        let title = req.params['title']

        const booksend = Object.keys(books).map(key => books[key]).filter((book) => book.title === title);
        resolve(booksend)
    })

        .then(value => {
            res.status(200).json({book: value})
        }).catch(err => res.status(404).json({message: "Not Found err:" + err})
        )

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params['isbn']

    const bookreviews = books[isbn].reviews

    bookreviews ? res.status(200).json({book: bookreviews}) : res.status(404).json({message: "Not Found"});
});

module.exports.general = public_users;
