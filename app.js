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
     maxAge: 7 * 24 * 60 * 60 * 1000
    },
    secret: process.env.SESSION_SECRET,
    rolling: false,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000, 
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
        require('./backend/api')(app);
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