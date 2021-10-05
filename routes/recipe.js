const router = require("express").Router();
const recipeController = require("../Controllers/recipeController");

/* CREATE NEW RECIPE */
router.post("/new", recipeController.newRecipe);

/* SEARCH RECIPE BY NAME */
router.get("/recipes", recipeController.searchRecipes);

/* GET RECIPE */
router.get("/:id", recipeController.getRecipe);

/* REMOVE RECIPE */
router.delete("/:id", recipeController.deleteRecipe);

/* UPDATE  NAME*/
router.patch("/name/:id", recipeController.udpateRecipeName);

/* UPDATE INGREDIENTS */
router.patch("/ingredients/:id", recipeController.updateRecipeIngredients);

/* ADD NEW INGREDIENT */
router.post("/ingredients/:id", recipeController.addIngredients);

/* REMOVE INGREDIENT */
router.delete("/ingredients/:id", recipeController.removeIngredient);

module.exports = router;
