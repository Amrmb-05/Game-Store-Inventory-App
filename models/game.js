const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameScheema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Number, required: true },
  developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  platform: {
    type: String,
    required: true,
    enum: [
      "PS5",
      "PS4",
      "Xbox Series X",
      "Xbox One",
      "Windows",
      "Mac",
      "Nintendo Switch",
    ],
  },
});

GameScheema.virtual("url").get(function () {
  return `catalog/game/${this._id}`;
});

module.exports = mongoose.model("Game", GameSchema);
