const Ingredient = require("../models/Ingredient");
/* CREATE NEW INGREDIENT */

exports.newIngredient = async (req, res, next) => {
  try {
    const { name } = req.body;

    const ingredient = new Ingredient({
      name,
    });

    await ingredient.save();
    res.json(ingredient);
  } catch (err) {
    res.json(next(err));
  }
};
