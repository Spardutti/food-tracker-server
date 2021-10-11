const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      const user = await User.findOne({ email: username });
      if (!user) return done(null, false);

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (isMatch) {
          // LOG IN
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
