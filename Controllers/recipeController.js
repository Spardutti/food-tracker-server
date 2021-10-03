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

/* GET RECIPE */
exports.getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "ingredients.ingredient"
    );

    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};
