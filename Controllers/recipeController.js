const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { uploadFile, deleteFileFromS3 } = require("../s3");

/* CREATES NEW RECIPE */
exports.newRecipe = async (req, res, next) => {
  try {
    const { instructions, ingredientId, qty, unit, author, rating } = req.body;
    const name = req.body.name.toLowerCase();
    const existingRecipe = await Recipe.findOne({ name });
    if (existingRecipe)
      return res
        .status(500)
        .json("A recipe with that name already exists, please try another");

    const ingredient = await Ingredient.findById(ingredientId);

    const imageUrl = await uploadFile(req.file);

    const recipe = new Recipe({
      name,
      instructions,
      author,
      image: imageUrl.Location,
      rating,
    });

    recipe.ingredients.push({
      ingredient,
      quantity: qty,
      name: ingredient.name,
      unit,
    });

    //await recipe.save();
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
    const recipes = await Recipe.find({
      name: new RegExp("^" + name + "$", "i"),
    });

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

/* UPDATES RECIPE INGREDIENTS QTY UNIT */
exports.updateRecipeIngredients = async (req, res, next) => {
  const { ingredientIndex, ingredientQty, ingredientUnit } = req.body;

  try {
    Recipe.findById(req.params.id, async (err, recipe) => {
      if (err) return res.json(err);
      if (!recipe) return res.json("Recipe not found");

      let ingredientModified = recipe.ingredients[ingredientIndex];

      ingredientModified.unit = ingredientUnit;
      ingredientModified.quantity = ingredientQty;

      recipe.markModified("ingredients");
      await recipe.save();

      res.json(recipe);
    });
    /*     const recipe = await Recipe.findById(req.params.id).populate(
      "ingredients.ingredient"
    );
    if (!recipe) return res.status(500).json("Recipe not found");

    let ingredientModified = recipe.ingredients[ingredientIndex];

    ingredientModified.unit = ingredientUnit;
    ingredientModified.quantity = ingredientQty;

    recipe.markModified("ingredient");
    await recipe.save();

    res.json(recipe); */
  } catch (err) {
    res.json(next(err));
  }
};

/* ADD INGREDIENT TO RECIPE */
exports.addIngredients = async (req, res, next) => {
  const { ingredientName, ingredientQty } = req.body;
  try {
    const ingredient = await Ingredient.findById(ingredientName);

    const newValues = {
      ingredient: ingredientName,
      quantity: ingredientQty,
      name: ingredient.name,
    };

    Recipe.findById(req.params.id, async (err, recipe) => {
      if (!recipe) return res.json("Recipe doest not exist");
      const ingredientsArr = recipe.ingredients;

      if (ingredientsArr.length === 0) {
        ingredientsArr.push(newValues);
      } else {
        for (let i = 0; i < ingredientsArr.length; i++) {
          if (ingredientsArr[i].name === ingredient.name) {
            return res.json(recipe);
          }
        }
        ingredientsArr.push(newValues);
      }
      recipe.markModified("ingredients");
      await recipe.save();
      res.json(recipe);
    });
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

/* LIKE THE RECIPE */
exports.likeRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { rating: 1 },
      },
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};

/* DISLIKE THE RECIPE */
exports.dislikeRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { rating: -1 },
      },
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};
