const Genre = require("../models/genre");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validatonResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find({}).sort({ name: 1 }).exec();
  res.render("genre_list", { title: "Genres", genres: genres });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();
  const genre_games = await Game.find(
    { genre: req.params.id },
    "title description",
  ).sort({ title: 1 });
});
