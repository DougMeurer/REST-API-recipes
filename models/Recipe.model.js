const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  level: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  cuisine: { type: String, required: true },
  dishType: { type: String, required: true },
  image: { type: String },
  duration: { type: Number, required: true },
  creator: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

const RecipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = RecipeModel;
