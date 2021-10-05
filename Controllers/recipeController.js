const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

/* CREATES NEW RECIPE */
exports.newRecipe = async (req, res, next) => {
  try {
    const { name, instructions, image, qty, unit, ingredient, author } =
      req.body;

    const recipe = new Recipe({
      name,
      instructions,
      //qty, unit, ingredients, author ?
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

/* SEARCH RECIPES BY NAME */
exports.searchRecipes = async (req, res, next) => {
  const { name } = req.body;
  try {
    const recipes = await Recipe.find({ name: new RegExp(name, "i") });

    res.json(recipes);
  } catch (err) {
    res.json(next(err));
  }
};

/* DELETE RECIPE */
exports.deleteRecipe = async (req, res, next) => {
  // ONLY THE AUTHOR WILL BE ABLE TO DELETE.
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

/* UPDATES RECIPE INGREDIENTS */
exports.updateRecipeIngredients = async (req, res, next) => {
  // UPDATE UNIT TOO
  const { ingredientIndex, ingredientQty } = req.body;
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "ingredients.ingredient"
    );
    if (!recipe) return res.status(500).json("Recipe not found");

    let ingredientModified = recipe.ingredients[ingredientIndex];
    ingredientModified.quantity = ingredientQty;

    recipe.markModified("ingredient");
    await recipe.save();

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
      ingredient: ingredientName,
      quantity: ingredientQty,
    };

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { ingredients: newValues },
      },
      { new: true }
    ).populate("ingredients.ingredient");

    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};

/* REMOVE RECIPE INGREDIENT */
exports.removeIngredient = async (req, res, next) => {
  const { ingredientId } = req.body;

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { ingredients: { ingredient: ingredientId } },
      },
      { new: true }
    ).populate("ingredients.ingredient");
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};
