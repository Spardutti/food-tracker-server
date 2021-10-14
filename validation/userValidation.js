const { body, validationResult } = require("express-validator");
const User = require("../models/User");

exports.validateNewUser = [
  body("username")
    .isLength({ min: 5 })
    .withMessage("El usuario debe tener al menos 5 caracteres")
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.findOne({ username: req.body.username }, function (err, user) {
          if (err) {
            reject(new Error("Server Error"));
          }
          if (Boolean(user)) {
            reject(new Error("Username already in use"));
          }
          resolve(true);
        });
      });
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres"),
  body("confirm", "Las contraseñas deben coincidir")
    .exists()
    .custom((value, { req }) => value === req.body.password),

  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(500)
        .json({ validationErrors: validationErrors.array() });
    next();
  },
];
