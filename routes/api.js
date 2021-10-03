var express = require("express");
var router = express.Router();
const recipeController = require("../Controllers/recipeController");
const ingredientController = require("../Controllers/ingredientController");

///////////// RECIPE  //////////////////////
/* CREATE NEW RECIPE */
router.post("/recipe", recipeController.newRecipe);

////////////// INGREDIENT //////////////////

router.post("/ingredient", ingredientController.newIngredient);
module.exports = router;
