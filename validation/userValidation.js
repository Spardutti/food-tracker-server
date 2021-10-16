const { body, validationResult } = require("express-validator");
const User = require("../models/User");

exports.validateNewUser = [
  body("username")
    .isLength({ min: 5 })
    .withMessage("El usuario debe tener al menos 5 caracteres")
    .custom(async (username) => {
      try {
        const user = await User.findOne({
          username: new RegExp("^" + username + "$", "i"),
        });
        if (user) return Promise.reject();
      } catch (error) {
        throw error;
      }
    })
    .withMessage("Usuario ya existe"),
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
