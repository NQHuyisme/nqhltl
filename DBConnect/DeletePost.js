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
var deletepost = {

    get: (req, res) => {
        if (req.session.isLoggedIn == true) {
            MongoClient.connect(URI, (err, db) => {
                if (err) console.log(err);
                var id = req.params.id;
                let dbo = db.db("myFirstDatabase");
                dbo.collection("posts").deleteOne({ _id: mongodb.ObjectId(id) });
                res.redirect('/dashboard');

            });
        } else {
            res.redirect('/dashboard');
        }

    },
}
module.exports = deletepost;