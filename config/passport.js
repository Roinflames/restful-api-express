const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import jwt from 'jsonwebtoken';
import { mongo } from './config'

// load up the user model
import User from '../models/user'

// load the auth variables
import { socialAuth } from './socialAuth'


module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    var opts = {};
   // revisa los headers
   opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
   opts.secretOrKey = mongo.secret;
   passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
     var id = jwt_payload._doc._id;
     User.findOne({_id: id}, (err, user) => {
       if (err) {
         return done(err, false);
       }
       if (user) {
         done(null, user);
       } else {
         done(null, false);
       }
      });
    }));

    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : socialAuth.googleAuth.clientID,
        clientSecret    : socialAuth.googleAuth.clientSecret,
        callbackURL     : socialAuth.googleAuth.callbackURL,

    }, (token, refreshToken, profile, jwt_payload, done) => {

        const { id, emails } = jwt_payload;
        const googleid = { id: id };

        // try to find the user based on their google id
        User.findOne({ 'google.id' : id })
          .then( user => {
            if(user){
              return done(null , user)
            }
            else{
              User.create({
                email: emails[0].value,
                google: googleid,
                password: id })
                .then( userCreate => {
                  return done(null , userCreate)
                })
                .catch( err => {
                  return done('El Email ya está siendo utilizado')
                })
            }
          })
          .catch( err => {
            return done('Problemas con el servidor')
          })
    }));
};
