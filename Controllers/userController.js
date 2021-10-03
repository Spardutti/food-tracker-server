const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { body, validationResult } = require("express-validator");

// CUANDO ACTUALIZAS UN ARRAY DE UN OBJECTO DE UNA BASE DE DATOS TIENES QUE PONER    user.markModified("fridge")
// EJEMPLO PARA CUANDO ACTUALICES EL FRIDGE. USER SERIA EL NOMBRE QUE LE DAS AL USER CUANDO LO BUSQUES EN LA DB.
// Y FRIDGE EL ARRAY QUE ESTAS MODIFICANDO.

/* CREATE NEW USER */
// WITH USERNAME ONLY
// POST

/* GET USERNAME BY USERNAME */
// GET

/* ADD AN EXISTING RECIPE TO THE USER */
// PUT

/* REMOVE A RECIPE FROM THE USER FAVORITES */
// DELETE

/* ADD INGREDIENTS TO THE USER FRIDGE */
// PUT

/* REMOVE INGREDIENTS FROM THE USER FRIDGE */
// DELETE