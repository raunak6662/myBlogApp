require('dotenv').config();
require('./passport');
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { application } = require('express');
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use(
  session({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SESSION_SECRET,
    rolling: false,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());


async function main() {
    try{
      function isLoggedIn(req, res, next){
        req.user ? next() : res.sendStatus(401);
      }
      app.get('/', welcomeR.welcomePage);
      app.get('/', (req, res) => {
        //res.send('<a href = "/auth/google  "> Sign in </a>');
        res.render("welcome")
      })
      app.get('/register', (req, res) => {
        res.redirect('/auth/google');
      })
      app.get('/auth/google', 
      passport.authenticate('google', {scope : ['email', 'profile']})
      );
      
      
      app.get('/auth/google/blogapp', 
          passport.authenticate('google', {
              successRedirect: '/protected',
              failureRedirect: '/fail'
          })
      );
  
      app.get('/logout', async(req, res) => {
        req.logOut(function(err) {
          if(err) throw err;
          req.session.destroy(function(err) {
            if(err) throw err;
            res.redirect('/');
          })
        });
      });
       
      app.get('/protected', isLoggedIn, (req, res) => {
        //res.send(req.user);
        res.redirect(`/blogs/${req.user.id}`);
      })

      app.get('/fail', (req, res) => {
        console.log("Something went worng !!!");
      })

      // get all blogs
      app.get('/blogs/:userID', isLoggedIn, async(req, res) => {
        const userEmail = req.user.emails[0].value;
        const userBlogs = await prisma.blog.findMany({
          where: {
            email: userEmail,
          },
        })
        //res.send(userBlogs);
        res.render('getUserBlogs', {data : userBlogs, userID : req.params.userID});

      })
      // add new blog
      app.get('/newBlog/:userID', isLoggedIn, async(req, res) => {
        // const userEmail = req.user.emails[0].value;
        // const newBlog = await prisma.blog.create({
        //   data: {
        //     title: req.body.title,
        //     content: req.body.content,
        //     email: userEmail,
        //   }
        // })
        res.render('createBlog', {userID : req.params.userID});
      })
      
      app.get('/blog/update/:userID/:blogID', isLoggedIn, async(req, res) => {
        const user = await prisma.blog.findUnique({
          where: {
            id: parseInt(req.params.blogID)
          }
        })
      })
    }catch(error){
      console.log(error);
    }finally{(async () => {})};
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

app.listen(3000, () =>{
  console.log("started")
})