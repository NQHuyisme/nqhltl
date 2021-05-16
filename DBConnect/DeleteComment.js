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
var deleteComment = {

    get: (req, res) => {
        if (req.session.isLoggedIn == true) {
            MongoClient.connect(URI, (err, db) => {
                if (err) console.log(err);
                var id = req.params.id;
                let dbo = db.db("myFirstDatabase");
                dbo.collection("posts").findOne({ _id: mongodb.ObjectId(id) }, (err, result) => {
                    dbo.collection("posts.comment").deleteOne({ commentuser: req.session.user }, (err, user) => {


                    })
                })
                res.redirect('/dashboard');

            });
        } else {
            res.redirect('/dashboard');
        }

    },
}
module.exports = deleteComment;