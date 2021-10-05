const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  image: String,
  instructions: String,
  ingredients: [
    {
      _id: false,
      ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
      quantity: Number,
    },
  ],
});

//ADD RECIPE AUTHOR AND EDIT PERM.

module.exports = mongoose.model("Recipe", RecipeSchema);
