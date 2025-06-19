const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!doesExist(username)){
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered, now you can login"});
        }else{
            return res.status(404).json({message: "User already exists!!."})
        }
    }
    return res.status(404).json({message: "Unable to register the user."});
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  //return res.status(300).json(JSON.stringify({books},null,4));
  return res.send(JSON.stringify(books,null,4));
});*/

const miPromesa = new Promise((resolve, reject) => {
    const datos = JSON.stringify(books,null,4);
    if(datos){
        resolve(datos);
    }else{
        reject("No hay libros en el registro.");
    }
});

public_users.get('/', function (req, res){
    miPromesa.then((message) => { return res.send(message); })
    .catch((message) => { return res.send(message); });
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
  return res.status(300).json({message: "Titulo no encontrado."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.send(JSON.stringify(books[isbn].reviews));
  }else{
    return res.status(300).json({message: "Libro no encontrado."});
  }
});

module.exports.general = public_users;
