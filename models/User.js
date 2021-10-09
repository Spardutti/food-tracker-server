const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  //password: String,
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  fridge: [
    {
      _id: false,
      ingredient: { type: Schema.Types.ObjectId, ref: "Ingredients" },
      name: String,
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
