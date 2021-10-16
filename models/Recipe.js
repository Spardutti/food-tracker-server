const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  image: String,
  instructions: String, //MAYBE IT SHOULD BE AN ARRAY TO BETTER ORGANIZE THE FRONTEND
  ingredients: [
    {
      _id: false,
      ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
      name: String,
      quantity: Number,
      unit: String, //gr, mm, etc
    },
  ],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  rating: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dateCreated: {
    type: Date,
    default: new Date().toLocaleString("en-US", {
      timeZone: "America/Montevideo",
    }),
  },
  comments: [
    {
      _id: false,
      author: { type: Schema.Types.ObjectId, ref: "User" },
      text: String,
      dateCreated: { type: Date, defalt: Date.now() },
    },
  ],
});

module.exports = mongoose.model("Recipe", RecipeSchema);
