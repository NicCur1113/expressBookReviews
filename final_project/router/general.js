const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  users.push({"username":req.body.username, "password":req.body.password})
  return res.json({message: "Customer successfully registered, you can now login!"})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  await res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const bookPromise = new Promise((resolve, reject) => {
    if(!books[req.params.isbn]){
      reject("Error")
      return res.status(400).json({message: "Out of book bounds."})
    }
    resolve("Books returned")
    return res.status(200).send(books[req.params.isbn])
  })
  bookPromise.then("Books returned").catch("Out of book bounds")
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const {author} = req.params
  let bookArr = []
  for(let i in books){
    bookArr.push(books[i])
  }

  if(!bookArr.author == author){
    return res.status(400).json({message: "Out of book bounds."})
  }
  await res.status(200).send(bookArr.filter((book) => {return book.author == author}))
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const {title} = req.params
  let bookArr = []
  for(let i in books){
    bookArr.push(books[i])
  }

  if(!bookArr.title == title){
     return await res.status(400).json({message: "Out of book bounds."})
  } 

  await res.status(200).send(bookArr.filter((book) => {return book.title == title}))
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  const {isbn} = req.params
    if(!books[isbn]){
      return res.status(400).json({message: "Out of book bounds."})
    }
    return await res.status(200).send(books[isbn].reviews)
});

module.exports.general = public_users;
