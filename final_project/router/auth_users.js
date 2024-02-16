const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')
const regd_users = express.Router();

let users = [];

regd_users.get("/", (req, res)=> {
  res.send(users)
})

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const userWithName = users.filter((user) => { return user.username === username});

  if(userWithName.length > 0){
    return true;
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign({
      data: password
    }, "access", {expiresIn: 60 * 60}) // expires in 1 hour.

    req.session.authorization = {
      accessToken, username
    }
    res.status(200).send("User has logged in successfully");
    console.log(accessToken)
  }
  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params
  const {review, username} = req.body
  books[isbn].reviews = {user: username, review: review}
  res.send({message: "Your review has been added!"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params
  const {username} = req.body

  if(books[isbn].reviews.username == username){
    books[isbn].reviews.filter((user) => { return books[isbn].reviews.username !== user.username})
    res.send({message: "Review has been deleted successfully!"})
  }
  res.json({message: "Review deleted!"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
