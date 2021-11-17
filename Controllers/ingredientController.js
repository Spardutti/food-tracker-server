const Ingredient = require("../models/Ingredient");

/* CREATE NEW INGREDIENT */

exports.newIngredient = [
  async (req, res, next) => {
    const { name } = req.body;
    try {
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

/* GET ALL INGREDIENTS ARRAY INFO */
exports.getAllIngredients = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.find({});
    return res.json(ingredient);
  } catch (err) {
    return res.json(next(err));
  }
};
