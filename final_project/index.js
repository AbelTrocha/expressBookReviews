const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const doesExist = require('./router/auth_users.js').isValid;
const users = require('./router/auth_users.js').users;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

app.post("/register", (req, res) => {
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
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
