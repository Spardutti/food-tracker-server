const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  image: String,
  instructions: String,
  ingredients: [],
});

module.exports = mongoose.model("Recipe", RecipeSchema);
