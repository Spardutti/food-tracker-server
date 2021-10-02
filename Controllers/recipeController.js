const Recipe = require("../models/Recipe");

/* CREATES NEW RECIPE */

exports.newRecipe = async (req, res, next) => {
  try {
    const { name, instructions, ingredients, image } = req.body;

    const recipe = new Recipe({
      name,
      instructions,
      ingredients,
      image,
    });

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};
