const { body, validationResult } = require("express-validator");
const Ingredient = require("../models/Ingredient");

exports.validateNewIngredient = [
  body("name")
    .notEmpty()
    .withMessage("Por favor ingrese un nombre para el ingrediente.")
    .not()
    .isNumeric()
    .withMessage("El nombre no puede contener solo numeros.")
    .custom(async (name) => {
      try {
        const ingredientName = await Ingredient.findOne({
          name: new RegExp("^" + name + "$", "i"),
        });
        if (ingredientName) return Promise.reject();
      } catch (error) {
        throw error;
      }
    })
    .withMessage("El nombre ya existe."),
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(500)
        .json({ validationErrors: validationErrors.array() });
    next();
  },
];
