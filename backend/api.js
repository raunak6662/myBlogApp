require('dotenv').config();
require('../passport');

const {
    PrismaClient
} = require('@prisma/client');
const {
    PrismaSessionStore
} = require('@quixo3/prisma-session-store');
const {
    application
} = require('express');
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const welcomeR = require('./utils/welcomeR');
const registerR = require('./utils/registerR');
const blogR = require('./utils/blogR');
const {
    createNewBlog,
    getAllBlogs
} = require('./utils/blogR');
const app = express();
const prisma = new PrismaClient();


module.exports = function (app) {

    function isLoggedIn(req, res, next) {
        req.user ? next() : res.sendStatus(401);
    }

    app.get('/', welcomeR.welcomePage);

    app.get('/register', registerR.registerGoogle);
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['email', 'profile']
    }));
    app.get('/auth/google/blogapp',
        passport.authenticate('google', {
            successRedirect: '/protected',
            failureRedirect: '/fail'
        })
    );
    // home page
    app.get('/protected', isLoggedIn, welcomeR.homePage);
    // error message if authentication fails
    app.get('/fail', (req, res) => {
        res.send("Something went worng !!!");
    })
    // all blogs on app
    app.get('/allblogs', isLoggedIn, blogR.getAllBlogsOnApp);

    // all user's blogs
    app.get('/blog/:userID/all', isLoggedIn, blogR.getAllBlogs);

    // add new blog
    app.get('/newBlog/:userID', isLoggedIn, blogR.addNewBlog);
    app.post('/blogs/:userID', isLoggedIn, blogR.createNewBlog);

    //add a comment
    //Cannot POST /comment/110473645853536496960/3
    //Cannot POST /comment/110473645853536496960/2
    app.post('/comment/:userID/:blogID', isLoggedIn, blogR.addComment);

    // open a blog
    //Cannot GET /feed/110473645853536496960/3
    //Cannot GET /feed/110473645853536496960/1
    app.get('/feed/:userID/:blogID', isLoggedIn, blogR.openBlog);

    // update your blogs
    app.get('/blog/update/:userID/:blogID', isLoggedIn, blogR.updateBlog);
    app.post('/blog/update/:userID/:blogID', isLoggedIn, blogR.updatedBlog);

    // delete your blogs
    app.get('/blog/delete/:userID/:blogID', isLoggedIn, blogR.deleteBlog);

    // logout
    app.get('/logout', isLoggedIn, welcomeR.logoutPage);
}