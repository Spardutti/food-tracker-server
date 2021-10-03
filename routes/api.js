var express = require("express");
var router = express.Router();
const recipeController = require("../Controllers/recipeController");

/* CREATE NEW RECIPE */
router.post("/recipe", recipeController.newRecipe);

module.exports = router;
