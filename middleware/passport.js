const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const User = require('../models/user');
const jwtkey = require('../config/secretKey');


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtkey
};


const strategy = new JwtStrategy(jwtOptions, async (payload, done) => {

  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }

});

passport.use(strategy);

module.exports = passport;
