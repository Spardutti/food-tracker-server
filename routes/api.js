var express = require("express");
var router = express.Router();
const recipeController = require("../Controllers/recipeController");
const ingredientController = require("../Controllers/ingredientController");
const userController = require("../Controllers/userController");

///////////// RECIPE  //////////////////////

/* CREATE NEW RECIPE */
router.post("/recipe", recipeController.newRecipe);

/* GET RECIPE */
router.get("/recipe/:id", recipeController.getRecipe);

////////////// INGREDIENT //////////////////

/* CREATE NEW INGREDIENT */
router.post("/ingredient", ingredientController.newIngredient);
module.exports = router;

////////////// USER /////////////////////////
