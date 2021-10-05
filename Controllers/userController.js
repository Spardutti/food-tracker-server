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
  const { name } = req.body; // name de nuevo ??
  try {
    const newRecipe = {
      recipe: {
        name,
      },
    }; // esto no hace nada tienes que buscar el recipe por ID no crear uno nuevo

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { newRecipe }, //push a donde ? user no es un array
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.json(next(err));
  }
};
// PATCH

/* REMOVE A RECIPE FROM THE USER FAVORITES */
// DELETE

/* ADD INGREDIENTS TO THE USER FRIDGE */
// PATCH

/* REMOVE INGREDIENTS FROM THE USER FRIDGE */
// DELETE
