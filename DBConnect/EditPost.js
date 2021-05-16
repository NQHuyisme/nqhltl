const URI = process.env.MONGO_URI
const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const session = require("express-session");

router.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,

}))
const MongoClient = mongodb.MongoClient;
var editpost = {
    get: (req, res) => {
        if (req.session.isLoggedIn == true) {
            MongoClient.connect(URI, (err, db) => {
                if (err) console.log(err);
                var id = req.params.id;
                let dbo = db.db("myFirstDatabase");
                dbo.collection("posts").findOne({ _id: mongodb.ObjectId(id) }, (err, result) => {
                    dbo.collection("users").findOne({ email: req.session.user }, (err, user) => {
                        res.render("editpost.ejs", {
                            post: result,
                            userSession: user
                        });
                    })


                })

            });
        } else {
            res.redict("/");
        }

    },
    post: (req, res) => {
        if (req.session.isLoggedIn == true) {
            MongoClient.connect(URI, (err, db) => {
                if (err) console.log(err);
                var id = req.params.id;
                let dbo = db.db("myFirstDatabase");
                dbo.collection("posts").findOne({ _id: mongodb.ObjectId(id) }, (err, result) => {
                    let query = {
                        $set: {
                            description: req.body.description,
                            image: "",
                        }
                    }
                    dbo.collection("posts").updateOne({ username: req.session.user }, query);


                    res.redirect('/dashboard');
                })

            });
        } else {
            res.redirect('/dashboard');
        }

    },
}
module.exports = editpost;