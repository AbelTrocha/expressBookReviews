const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let sameUsername = users.filter((user) => {
        return (user.username === username);
    });
    if(sameUsername.length > 0){
        return true;
    }else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if(validUsers.length > 0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({data: password},'access', {expiresIn: 60 * 60});
    req.session.authorization = { accessToken, username}
    return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({message: "Invalid login. Check username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    let user = req.session.authorization['username'];
    let review = book.reviews[user];
    if(review){
        book.reviews[user] = req.body.review;
        return res.status(200).send("Book review successfully updated.");
    }else{
        book.reviews[user] = req.body.review;
        return res.status(200).send("Book review successfully added.");
    }
  }else{
    return res.status(300).json({message: "Book not found."});
  }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        let user = req.session.authorization['username'];
        let review = book.reviews[user];
        if(review){
            delete book.reviews[user];
            return res.status(200).send("The user's review for this book was successfully deleted.");
        }else{
            return res.status(200).send("The user don't have review for this book.");
        }
    }else{
        return res.status(300).json({message: "Book not found."});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
