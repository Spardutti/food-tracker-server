const { body, validationResult } = require("express-validator");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const Ingredient = require("../models/Ingredient");

exports.validateNewRecipe = [
  body("name")
    .notEmpty()
    .withMessage("Por favor ingrese un nombre para la receta.")
    .custom(async (name) => {
      try {
        const recipeName = await Recipe.findOne({
          name: new RegExp("^" + name + "$", "i"),
        });
        if (recipeName) return Promise.reject();
      } catch (error) {
        throw error;
      }
    })
    .withMessage("Nombre de receta ya utilizado, por favor intente con otro."),
  body("instructions")
    .notEmpty()
    .withMessage("Por favor escriba las instrucciones."),
  body("ingredientId")
    .notEmpty()
    .withMessage("Por favor elija al menos 1 ingrediente."),
  body("qty")
    .notEmpty()
    .withMessage("Por favor ingrese la cantidad.")
    .isNumeric()
    .withMessage("Por favor ingrese solo numeros."),
  body("unit").notEmpty().withMessage("Por favor elija una unidad"),
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(500)
        .json({ validationErrors: validationErrors.array() });
    next();
  },
];
