const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DevSchema = new Schema({
  name: { type: String, required: true },
});

DevSchema.virtual("url").get(function () {
  return `/catalog/dev/${this._id}`;
});

module.exports = mongoose.model("Developer", DevSchema);
