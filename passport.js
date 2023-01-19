const { PrismaClient, User } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store'); 
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const prisma = new PrismaClient();


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/blogapp"
  },
  async function(accessToken, refreshToken, profile, cb) {
    let userEmail = profile.emails[0].value;
    const hasUser = await prisma.User
    .findUnique({
      where: {
        email: userEmail,
      },
    })
    .catch((err) => {
      console.log(err);
    })
    if(!hasUser){
      const newUser = await prisma.User.create({
        data: {
          email: userEmail,
        },
      })
    }
    return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb){
  cb(null, user);
})

passport.deserializeUser(function(user, cb){
  cb(null, user);
})