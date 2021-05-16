const path = require("path")
const dotenv = require("dotenv")
const express = require("express");
const exphbs = require("express-handlebars");

const app = express();
const bodyParser = require("body-parser");

const router = express.Router();
const session = require("express-session");
dotenv.config({ path: "./DBConnect/config.env" })
const connectDB = require("./DBConnect/DBConn");
const flash = require("express-flash")

const mongodb = require("mongodb")

const passport = require("passport");

const link_preview = require("kahaki");


const URI = process.env.MONGO_URI

const server = require("http").createServer(app);

const io = require("socket.io")(server);


const Post = require("./DBConnect/post.js");

//Passport config
require("./DBConnect/passport")(passport)

connectDB();

//Handlebars
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(flash())

//Session
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())


var MongoClient = require("mongodb").MongoClient;
app.use(function(req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
});

// --------- Configure Routes -----------
const routes = require("./routes");
app.use("/", routes);
app.use("/auth", require("./routes/auth"))

app.use(bodyParser.urlencoded({ extended: true }));


io.on("connection", (socket) => {
    socket.on("new_user", data => {
        socket.join(`${data}`)
            // listen event comment
        socket.on("clientSend", (data) => {
            MongoClient.connect(URI, (err, db) => {
                let dbo = db.db("myFirstDatabase");
                // find on database
                dbo.collection("users").findOne({ email: data.commentuser }, (err, user) => {
                    if (err) console.log(err);
                    dbo.collection("posts").findOne({ _id: mongodb.ObjectId(data.post_id) }, (err, p) => {
                        dbo.collection("posts").updateOne({ _id: mongodb.ObjectId(data.post_id) }, {
                            $push: {
                                comment: {
                                    commentuser: data.commentuser,
                                    avatarcomment: user.image,
                                    comment: data.mes
                                }
                            }
                        });
                        console.log(data)
                        console.log(p)
                        io.sockets.in(`${data.post_id}`).emit("serverSend", {
                            commentuser: data.commentuser,
                            avatarcomment: user.image,
                            comment: data.mes,
                            commentcount: p.comment.length + 1
                        });
                    });
                });
            });
        });
    });
})

io.on("connection", (socket) => {
    // listen event like 
    socket.on("like_post", (data) => {
        socket.join(`${data.id}-like`);
        console.log(data.id);
        MongoClient.connect(URI, (err, db) => {
            let dbo = db.db("myFirstDatabase");
            dbo.collection("posts").findOne({ _id: mongodb.ObjectId(data.id) }, (err, p) => {
                if (p.like.includes(data.userSession) == false) {
                    dbo.collection("posts").updateOne({ _id: mongodb.ObjectId(data.id) }, {
                        $push: {
                            like: `${data.userSession}`
                        }
                    });
                    dbo.collection("posts").findOne({ _id: mongodb.ObjectId(data.id) }, (err, result) => {
                        io.sockets.emit(`server_send_likecount_${data.id}`, {
                            likecount: result.like.length + 1,
                        });
                        socket.leave(`${data.id}-like`);
                    });
                }
            });
        });
    });
})

app.use("/public", express.static(__dirname + "/public"));
//Static folder

app.use("/stylesheets", express.static(__dirname + "/public/stylesheets"))
app.use("/javascripts", express.static(__dirname + "/public/javascripts"))
app.use("/image", express.static(__dirname + "/public/image"))
app.use("/css", express.static(__dirname + "/public/css"))
app.use("/partials", express.static(__dirname + "/views/partials"))

var port = process.env.PORT;
// run server
server.listen(port, function() {
    console.log("Server is listening on port 8000");
});