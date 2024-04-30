const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameScheema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Gerne" }],
});

GameScheema.virtual(
  "url",
  get(function () {
    return `catalog/game/${this._id}`;
  }),
);
