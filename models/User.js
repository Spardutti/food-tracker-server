const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  fridge: [
    {
      _id: false,
      ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredients" },
      name: String,
      quantity: Number,
      unit: String,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
