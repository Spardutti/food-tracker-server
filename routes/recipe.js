const router = require("express").Router();
const recipeController = require("../Controllers/recipeController");
const multer = require("multer");
const passport = require("passport");
const recipeValidation = require("../validation/recipeValidation");

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

/* GET */

/* SEARCH RECIPE BY NAME */
router.get("/recipes", recipeController.searchRecipes);

/* SEARCH NEW RECIPES */
router.get("/latestRecipes", recipeController.latestRecipes);

/* GET ALL RECIPES ARRAY INFO */
router.get("/allRecipes", recipeController.getAllRecipes);

/* GET RECIPES BY AUTHOR */
router.get("/author", jwtProtected, recipeController.getRecipeByAuthor);

/* GET RECIPE */
router.get("/:id", recipeController.getRecipe);

/* POST */

/* CREATE NEW RECIPE */
router.post(
  "/new",
  jwtProtected,
  upload.single("image"),
  recipeValidation.validateNewRecipe,
  recipeController.newRecipe
);

/* ADD NEW INGREDIENT */
router.post("/ingredients/:id", jwtProtected, recipeController.addIngredients);

/* ADD NEW COMMENT */
router.post("/newComment", jwtProtected, recipeController.newComment);

/* PATCH */

/* UPDATE  NAME*/
router.patch("/name/:id", recipeController.udpateRecipeName);

/* UPDATE INGREDIENTS */
router.patch("/ingredients/:id", recipeController.updateRecipeIngredients);

/* LIKE RECIPE */
router.patch("/like/:id", jwtProtected, recipeController.likeRecipe);

/* DISLIKE RECIPE */
router.patch("/dislike/:id", jwtProtected, recipeController.dislikeRecipe);

/* EDIT COMMENT TEXT */
router.patch("/comment/:id", recipeController.editComment);

/* DELETE */

/* REMOVE RECIPE */
router.delete("/:id", jwtProtected, recipeController.deleteRecipe);

/* REMOVE INGREDIENT */
router.delete("/ingredients/:id", recipeController.removeIngredient);

/* DELETE COMMENT */
router.delete("/comment/:id", recipeController.deleteComment);

module.exports = router;
