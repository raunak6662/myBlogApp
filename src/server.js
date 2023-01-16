require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { application } = require('express');
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");
const passport = require("passport");
require('./passport');
const app = express();
const prisma = new PrismaClient();

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
      app.get('/', (req, res) => {
        res.send('<a href = "/auth/google  "> Sign in </a>');
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
      
      app.get('/protected', isLoggedIn, (req, res) => {
        res.send(req.user);
      })
      
      app.get('/fail', (req, res) => {
        console.log("Something went worng !!!");
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