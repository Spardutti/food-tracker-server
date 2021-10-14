const router = require("express").Router();
const userController = require("../Controllers/userController");
const passport = require("passport");
const userValidation = require("../validation/userValidation");

const jwtProtected = passport.authenticate("jwt", { session: false });

/* CREATE NEW USER */
router.post(
  "/newLocalUser",
  userValidation.validateNewUser,
  userController.newUser
);

/* LOG IN LOCAL */
router.post("/localLogin", userController.localLogin);

/* GET USER */
router.get("/getuser", jwtProtected, userController.getUser);

/* ADD RECIPE USER */
router.patch("/recipeadd/:id", jwtProtected, userController.addRecipeUser);

/* REMOVE RECIPE USER */
router.patch("/recipedel/:id", userController.deleteRecipeUser);

/* ADD INGREDIENT FRIDGE */
router.patch("/ingredientadd/:id", userController.addIngredientFridge);

/* DELETE INGREDIENT FRIDGE */
router.patch("/ingredientdel/:id", userController.removeIngredientFridge);

/* MODIFY INGREDIENT FRIDGE COUNT */
router.patch("/ingredientCountMod/:id", userController.modifyIngredientCount);

module.exports = router;
