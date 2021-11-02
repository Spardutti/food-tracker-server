const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: String,
  image: String,
  instructions: String, //MAYBE IT SHOULD BE AN ARRAY TO BETTER ORGANIZE THE FRONTEND
  ingredients: [
    {
      _id: false,
      ingredientId: String,
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
      author: { type: Schema.Types.ObjectId, ref: "User" },
      username: String,
      text: String,
      dateCreated: {
        type: Date,
        default: new Date().toLocaleString("en-US", {
          timeZone: "America/Montevideo",
        }),
      },
    },
  ],
});

module.exports = mongoose.model("Recipe", RecipeSchema);
