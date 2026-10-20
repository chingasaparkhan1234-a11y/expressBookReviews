const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Жаңа қолданушыны тіркеу
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const doesExist = users.some((user) => user.username === username);
  if (doesExist) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1: Барлық кітаптарды алу
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: ISBN бойынша алу
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 3: Автор бойынша алу
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found by this author" });
});

// Task 4: Атауы бойынша алу
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Пікірлерді алу
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using async/await
async function getAllBooksAsync() {
  try {
    const res = await axios.get("http://localhost:5000/");
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

// Task 11: Get book by ISBN using Promises
function getBookByISBNPromise(isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
}

// Task 12: Get book by Author using async/await
async function getBookByAuthorAsync(author) {
  try {
    const res = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

// Task 13: Get book by Title using Promises
function getBookByTitlePromise(title) {
  axios.get(`http://localhost:5000/title/${title}`)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
}

module.exports.general = public_users;