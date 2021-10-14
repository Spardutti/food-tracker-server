const router = require("express").Router();
const recipeController = require("../Controllers/recipeController");
const multer = require("multer");
const passport = require("passport");

const jwtProtected = passport.authenticate("jwt", { session: false });

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    // THE IMAGE DEFAULT NAME
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
});

/* CREATE NEW RECIPE */
router.post("/new", upload.single("image"), recipeController.newRecipe);

/* SEARCH RECIPE BY NAME */
router.get("/recipes", recipeController.searchRecipes);

/* SEARCH NEW RECIPES */
router.get("/latestRecipes", recipeController.latestRecipes);

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

/* LIKE RECIPE */
router.patch("/like/:id", recipeController.likeRecipe);

/* DISLIKE RECIPE */
router.patch("/dislike/:id", recipeController.dislikeRecipe);

module.exports = router;
