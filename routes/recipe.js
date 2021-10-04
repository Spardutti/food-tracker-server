var express = require("express");
var router = express.Router();
const recipeController = require("../Controllers/recipeController");

/* CREATE NEW RECIPE */
router.post("/new", recipeController.newRecipe);

/* GET RECIPE */
router.get("/:id", recipeController.getRecipe);

module.exports = router;
