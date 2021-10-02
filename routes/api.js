var express = require("express");
var router = express.Router();
const recipeController = require("../Controllers/recipeController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("culon");
});

/* CREATE NEW RECIPE */
router.post("/recipe", recipeController.newRecipe);

module.exports = router;
