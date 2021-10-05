const router = require("express").Router();
const userController = require("../Controllers/userController");

/* CREATE NEW USER */
router.post("/new", userController.newUser);

/* ADD RECIPE USER */
router.patch("/recipe/:id", userController.addRecipeUser);

module.exports = router;
