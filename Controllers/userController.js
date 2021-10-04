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
    const { name } = req.body; //name ???

    const user = new User({
      username, // de donde sale username ??
    });

    //await user.save();

    //no retorna nada..
  } catch (err) {
    res.json(next(err));
  }
};

/* GET USERNAME BY USERNAME */
exports.getUsername = async (req, res, next) => {
  try {
  } catch (err) {
    res.json(next(err));
  }
};

// GET

/* ADD AN EXISTING RECIPE TO THE USER */
// PUT

/* REMOVE A RECIPE FROM THE USER FAVORITES */
// DELETE

/* ADD INGREDIENTS TO THE USER FRIDGE */
// PUT

/* REMOVE INGREDIENTS FROM THE USER FRIDGE */
// DELETE
