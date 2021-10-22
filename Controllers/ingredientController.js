const Ingredient = require("../models/Ingredient");
const { body, validationResult } = require("express-validator");

/* CREATE NEW INGREDIENT */

exports.newIngredient = [
  body("name").notEmpty().withMessage("Please add ingredient name"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      const ingredientExist = await Ingredient.findOne({
        name: new RegExp("^" + name + "$", "i"),
      });

      if (ingredientExist) {
        return res.status(500).json("Ingredient already exist");
      }

      const ingredient = new Ingredient({
        name,
      });

      await ingredient.save();
      res.json(ingredient);
    } catch (err) {
      res.json(next(err));
    }
  },
];
