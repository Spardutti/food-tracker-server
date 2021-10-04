const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

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

/* DELETE RECIPE */
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndRemove(req.params.id);
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};

/* UDPATES RECIPE NAME */
exports.udpateRecipeName = async (req, res, next) => {
  const { name } = req.body;
  try {
    const newName = {
      name,
    };

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $set: newName,
      },
      { new: true }
    );

    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};
// TODO FIX THIS
/* UPDATES RECIPE INGREDIENTS */
exports.updateRecipeIngredients = async (req, res, next) => {
  const { ingredientName, ingredientQty } = req.body;
  try {
    const newValues = {
      ingredients: {
        ingredient: ingredientName,
        quantity: ingredientQty,
      },
    };

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: { ...newValues } },
      { upsert: true, new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};

/* ADD INGREDIENT TO RECIPE */
exports.addIngredients = async (req, res, next) => {
  const { ingredientName, ingredientQty } = req.body;
  try {
    const newValues = {
      ingredients: {
        ingredient: ingredientName,
        quantity: ingredientQty,
      },
    };

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $push: { newValues },
      },
      { new: true }
    );

    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};
