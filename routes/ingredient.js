const router = require("express").Router();
const ingredientController = require("../Controllers/ingredientController");
const ingredientValidation = require("../validation/ingredientValidation");

///agregar token
/* CREATE NEW INGREDIENT */
router.post(
  "/new",
  ingredientValidation.validateNewIngredient,
  ingredientController.newIngredient
);

/* GET ALL INGREDIENTS ARRAY INFO */
router.get("/allIngredients", ingredientController.getAllIngredients);

module.exports = router;
