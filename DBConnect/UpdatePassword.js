const URI = process.env.MONGO_URI

const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const mongodb = require("mongodb");
const session = require("express-session");
const User = require("./User");
const Online = require("./Online.js")
router.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,

}))

const MongoClient = mongodb.MongoClient;

var login = {
    post: (req, res) => {
        MongoClient.connect(URI, (err, db) => {
            if (err) { console.log(err) }
            console.log(req.body)
                // check user in database
            let dbo = db.db("myFirstDatabase")
            dbo.collection("users").find({ email: req.body.email }).toArray((err, user) => {
                if (err) { console.log(err) }
                // not have user


                let hashedPassword = bcrypt.hash(req.body.newpassword, 10).then(function(hashedPassword) {
                    let temp = {
                        password: hashedPassword,
                    }
                    let userss = new User(temp);

                    console.log(userss.password)
                    let query = {
                        $set: {
                            password: userss.password,
                        }
                    }
                    dbo.collection("users").updateOne({ email: req.session.user }, query);
                    console.log(user[0].password)
                })
                res.redirect('/dashboard');
            })
        })
    },
}
module.exports = login