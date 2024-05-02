const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const { body, validatonResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find({}).sort({ title: 1 }).exec();
  res.render("genre_list", { title: "Genres", genres: genres });
});
