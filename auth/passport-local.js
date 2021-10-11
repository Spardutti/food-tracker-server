const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    /*     {
      usernameField: "email",
    }, */
    async (username, password, done) => {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "Wrong username" });

      bcrypt.compare(password, user.password, (err, isMatch) => {
<<<<<<< HEAD
=======
        if (err) return err;
>>>>>>> 8064374c042ab3905179e1f79146dc5a73d9b9a1
        if (isMatch) {
          // LOG IN
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong Password" });
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
