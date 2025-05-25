const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //return res.status(300).json(JSON.stringify({books},null,4));
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.send(JSON.stringify(books[isbn],null,4));
  }else{
    return res.status(300).json({message: "Libro no encontrado"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const llaves = Object.keys(books);
  let author_books = [];
  llaves.forEach(
    (llave) => {
        if(books[llave].author === author){
            author_books.push(books[llave]);
        }
    }
  );
  if(author_books.length > 0){
    return res.send(JSON.stringify(author_books, null, 4));
  }else{
    return res.status(300).json({message: "El autor no tiene libros."});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const llaves = Object.keys(books);
  llaves.forEach(
    (llave) => {
        if(books[llave].title === title){
            return res.send(JSON.stringify(books[llave],null,4));
        }
    }
  );
  return res.status(300).json({message: "Titulo no encontrado"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
