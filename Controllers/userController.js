const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require("../models/User");

/* CREATE NEW USER */
exports.newUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    let usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(500).json("Username already exists.");
    }
    const user = new User({
      username,
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.json(next(err));
  }
};

/* ADD AN EXISTING RECIPE TO THE USER */
exports.addRecipeUser = async (req, res, next) => {
  const { recipeID } = req.body;
  try {
    const recipe = await Recipe.findById(recipeID);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { recipes: recipe },
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.json(next(err));
  }
};
/* REMOVE A RECIPE FROM THE USER FAVORITES */
exports.deleteRecipeUser = async (req, res, next) => {
  const { recipeId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { recipes: recipeId },
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.json(next(err));
  }
};

/* ADD INGREDIENTS TO THE USER FRIDGE */
exports.addIngredientFridge = async (req, res, next) => {
  const { ingredientId, ingredientQty, ingredientName } = req.body;
  try {
    const ingredient = await Ingredient.findById(ingredientId);

    const ingredientToAdd = {
      ingredient: ingredientName,
      quantity: ingredientQty,
      name: ingredient.name,
    };

    User.findById(req.params.id, async (err, user) => {
      if (!user) return res.json("User doesnt exist");
      const ingredientsArr = user.fridge;

      if (ingredientsArr.length === 0) {
        ingredientsArr.push(ingredientToAdd);
      } else {
        for (let i = 0; i < ingredientsArr.length; i++) {
          if (ingredientsArr[i].name === ingredient.name) {
            return res.json(user);
          }
        }
        ingredientsArr.push(ingredientToAdd);
      }
      user.markModified("ingredients");
      await user.save();
      res.json(user);
    });
  } catch (err) {
    res.json(next(err));
  }
};

/* REMOVE INGREDIENT FROM THE USER FRIDGE */
exports.removeIngredientFridge = async (req, res, next) => {
  const { ingredientName } = req.body;
  try {
    User.findById(req.params.id, async (err, user) => {
      const ingredientsArr = user.fridge;

      for (let i = 0; i < ingredientsArr.length; i++) {
        if (ingredientsArr[i].name === ingredientName) {
          ingredientsArr.splice(i, 1);
          console.log(ingredientsArr);
        }
      }
      user.markModified("ingredients");
      await user.save();
      res.json(user);
    });
  } catch (err) {
    res.json(next(err));
  }
};

/* MODIFY INGREDIENTS FRIDGE COUNT */
exports.modifyIngredientCount = async (req, res, next) => {
  const { ingredientName, ingredientCount } = req.body;
  try {
    User.findById(req.params.id, async (err, user) => {
      const ingredientsArr = user.fridge;

      for (let i = 0; i < ingredientsArr.length; i++) {
        if (ingredientsArr[i].name === ingredientName) {
          ingredientsArr[i].quantity += parseInt(ingredientCount);
        }
      }
      user.markModified("ingredients");
      await user.save();
      res.json(user);
    });
  } catch (err) {
    res.json(next(err));
  }
};
