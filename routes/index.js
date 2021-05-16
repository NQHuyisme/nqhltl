const express = require("express")
const router = express.Router()
const multer = require("multer");
const { ensureAuth, ensureGuest } = require("../MiddleWare/auth");
const session = require("express-session");
const link_preview = require("kahaki");

//Routes
const signup = require("../DBConnect/SignUp.js");
const login = require("../DBConnect/Login.js");
const dashboard = require("../DBConnect/Dashboard.js");
const home = require("../DBConnect/Home.js");
const logout = require("../DBConnect/LogOut.js");

const profile = require("../DBConnect/Profile.js");

const editprofile = require("../DBConnect/EditProfile.js");

const createpost = require("../DBConnect/CreatePost.js");
const editPost = require("../DBConnect/EditPost.js")
const deleteComment = require("../DBConnect/DeleteComment.js")
const deletePost = require("../DBConnect/DeletePost.js")
const posts = require("../DBConnect/Posts.js");
const updatepassword = require("../DBConnect/UpdatePassword.js")
router.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,

}))

const path = "D:/web-nqhltl";
// setup upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path + "/public/image");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})
var storage_avatar = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path + "/public/image/avatar");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage })
var upload_avatar = multer({ storage: storage_avatar })


router.get("/", home.get);

router.get("/dashboard", dashboard.get);
router.get("/logout", logout.get);

router.post("/signup", signup.post)
router.get("/signup", signup.get)

router.post("/login", login.post);

router.get("/editprofile", editprofile.get);
router.post("/editprofile", editprofile.post);

router.post("/updatepassword", updatepassword.post);
router.get("/profile/:username", profile.get);



router.post("/createPost", upload.single("file_image"), createpost.post);

router.get("/editPost/:id", editPost.get);

router.get("/deletePost/:id", deletePost.get);

router.get("/post/:id", posts.get);

router.get("/deleteComment/:cmt/:user", deleteComment.get)


module.exports = router