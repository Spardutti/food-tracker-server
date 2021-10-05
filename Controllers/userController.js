const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { body, validationResult } = require("express-validator");

// CUANDO ACTUALIZAS UN ARRAY DE UN OBJECTO DE UNA BASE DE DATOS TIENES QUE PONER    user.markModified("fridge")
// EJEMPLO PARA CUANDO ACTUALICES EL FRIDGE. USER SERIA EL NOMBRE QUE LE DAS AL USER CUANDO LO BUSQUES EN LA DB.
// Y FRIDGE EL ARRAY QUE ESTAS MODIFICANDO.

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

/* GET USER BY USERNAME */

/* ADD AN EXISTING RECIPE TO THE USER */
exports.addRecipeUser = async (req, res, next) => {
  const { name } = req.body;
  try {
    const newRecipe = {
      recipe: {
        name,
      },
    };

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { newRecipe },
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
// PUT

/* REMOVE INGREDIENTS FROM THE USER FRIDGE */
// DELETE
