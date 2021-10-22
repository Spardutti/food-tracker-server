const router = require("express").Router();
const ingredientController = require("../Controllers/ingredientController");

/* CREATE NEW INGREDIENT */
router.post("/new", ingredientController.newIngredient);
module.exports = router;
