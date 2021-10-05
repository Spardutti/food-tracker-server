const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { body, validationResult } = require("express-validator");

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
  const { id } = req.body;
  try {
    const recipe = await Recipe.findById(id);
    let recipeExist = await User.findOne({ recipes: recipe });
    if (recipeExist) {
      return res.status(500).json("Recipe already added.");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { recipes: recipe },
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
  const { id } = req.body;
  try {
    const recipe = await Recipe.findById(id);
  } catch (err) {
    res.json(next(err));
  }
};

// DELETE

/* ADD INGREDIENTS TO THE USER FRIDGE */
// PATCH

/* REMOVE INGREDIENTS FROM THE USER FRIDGE */
// DELETE
