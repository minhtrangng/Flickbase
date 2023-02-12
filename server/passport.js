const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
// const GOOGLE_CLIENT_ID = "298685441331-arqa1q8ccll3hd4idatv3tininfrdfq4.apps.googleusercontent.com"
// const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
  clientID: "298685441331-arqa1q8ccll3hd4idatv3tininfrdfq4.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3001/api/auth/google/callback",
  //passReqToCallback: true
  },
  // function(accessToken, refreshToken, profile, cb, done) {
  //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //      return cb(err, user);
  //    });
  //    done(null, profile)
  // }
  function (request, accessToken, refreshToken, profile, done){
    return done(null, profile)
  }
));

passport.serializeUser((user, done)=> {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})