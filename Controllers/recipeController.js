const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { uploadFile, deleteFileFromS3 } = require("../s3");

/* CREATES NEW RECIPE */
exports.newRecipe = async (req, res, next) => {
  try {
    const { instructions, ingredientId, qty, unit, name } = req.body;

    /*     const existingRecipe = await Recipe.findOne({
      name: new RegExp("^" + name + "$", "i"),
    });
    if (existingRecipe)
      return res
        .status(500)
        .json("A recipe with that name already exists, please try another");*/

    const ingredient = await Ingredient.findById(ingredientId);

    ///if (!req.file) return res.json("Please select and image");
    const imageUrl = await uploadFile(req.file);

    const recipe = new Recipe({
      name,
      instructions,
      author: req.user._id,
      image: imageUrl.Location,
    });

    recipe.ingredients.push({
      ingredient: ingredient._id,
      quantity: qty,
      unit,
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
    const recipe = await Recipe.findById(req.params.id)
      .populate("ingredients.ingredient")
      .populate("author");

    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};

/* GET LATEST RECIPES */
exports.latestRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({}).sort({ dateCreated: -1 }).limit(3);
    if (!recipes) return res.json("No recipes");
    return res.json(recipes);
  } catch (err) {
    return res.json(next(err));
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
    );
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
        $addToSet: { rating: req.user._id },
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
        $pull: { rating: req.user._id },
      },
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};

/* ADD NEW COMMENT TO RECIPE */
exports.newComment = async (req, res, next) => {
  const { recipeId, text } = req.body;

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        $push: {
          comments: {
            author: req.user._id,
            text,
          },
        },
      },
      { new: true }
    );

    res.json(recipe);
  } catch (error) {
    res.json(next(error));
  }
};

/* EDIT COMMENT */
exports.editComment = async (req, res, next) => {
  try {
    const { commentId, text } = req.body;
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, "comments._id": commentId },
      {
        $set: {
          "comments.$.text": text,
        },
      },
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};

/* DELETE COMMENT */
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true }
    );
    res.json(recipe);
  } catch (err) {
    res.json(next(err));
  }
};
