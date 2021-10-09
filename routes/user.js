const router = require("express").Router();
const userController = require("../Controllers/userController");

/* CREATE NEW USER */
router.post("/new", userController.newUser);

/* ADD RECIPE USER */
router.patch("/recipeadd/:id", userController.addRecipeUser);

/* REMOVE RECIPE USER */
router.patch("/recipedel/:id", userController.deleteRecipeUser);

/* ADD INGREDIENT FRIDGE */
router.patch("/ingredientadd/:id", userController.addIngredientFridge);

/* DELETE INGREDIENT FRIDGE */
router.patch("/ingredientdel/:id", userController.removeIngredientFridge);

/* MODIFY INGREDIENT FRIDGE COUNT */
router.patch("/ingredientCountMod/:id", userController.modifyIngredientCount);

module.exports = router;
