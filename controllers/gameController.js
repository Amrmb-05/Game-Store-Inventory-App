const Game = require("../models/game");
const Dev = require("../models/developer");
const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numGames,
    numDevs,
    numGenres,
    numPs4,
    numPs5,
    numXboxSX,
    numXboxOne,
    numWindows,
    numSwitch,
  ] = await Promise.all([
    Game.countDocuments({}).exec(),
    Dev.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
    Game.countDocuments({ platform: "PS4" }).exec(),
    Game.countDocuments({ platform: "PS5" }).exec(),
    Game.countDocuments({ platform: "Xbox Series X" }).exec(),
    Game.countDocuments({ platform: "Xbox One" }).exec(),
    Game.countDocuments({ platform: "Windows" }).exec(),
    Game.countDocuments({ platform: "Nintendo Switch" }).exec(),
  ]);
  res.render("index", {
    title: "Game Inventory",
    game_count: numGames,
    dev_count: numDevs,
    genre_count: numGenres,
    ps4_count: numPs4,
    ps5_count: numPs5,
    xboxSX_count: numXboxSX,
    xboxOne_count: numXboxOne,
    windows_count: numWindows,
    switch_count: numSwitch,
  });
});

// Display list of all games
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({}, "title developer")
    .sort({ title: 1 })
    .populate("developer")
    .exec();

  res.render("game_list", { title: "Game list", games: allGames });
});

// Display details of each book

exports.game_detail = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id)
    .populate("developer")
    .populate("genre")
    .exec();

  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game_detail", { title: game.title, game: game });
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
  const [devs, genres] = await Promise.all([
    Dev.find({}).sort({ name: 1 }).exec(),
    Genre.find({}).sort({ name: 1 }).exec(),
  ]);
  const platforms = [
    "PS5",
    "PS4",
    "Xbox Series X",
    "Xbox One",
    "Windows",
    "Nintendo Switch",
  ];
  res.render("game_form", {
    title: "Add Game",
    devs: devs,
    genres: genres,
    platforms: platforms,
  });
});
