var express = require("express");
var router = express.Router();
const ingredientController = require("../Controllers/ingredientController");

/* CREATE NEW INGREDIENT */
router.post("/new", ingredientController.newIngredient);
module.exports = router;
