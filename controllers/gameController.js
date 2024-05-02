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

exports.game_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
    // if (!Array.isArray(req.body.platform)) {
    //   req.body.platform =
    //     typeof req.body.platform === "undefined" ? [] : [req.body.platform];
    // }
    // next();
  },

  body("title", "Title must not be empty").trim().isLength({ min: 3 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  body("developer", "Developer must not be empty")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("inStock", "inStock must bot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),
  body("platform.*").escape(),

  asyncHandler(async (req, res, next) => {
    // Get validation errors from the request
    const errors = validationResult(req);

    const game = new Game({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      inStock: req.body.inStock,
      developer: req.body.developer,
      genre: req.body.genre,
      platform: req.body.platform,
    });

    if (!errors.isEmpty()) {
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

      // Mark our selected genres as checked.
      for (const genre of genres) {
        if (game.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      for (const platform of platforms) {
        if (game.platform.includes(platform)) {
          platform.checked = "true";
        }
      }
      res.render("game_form", {
        title: "Add Game",
        devs: devs,
        genres: genres,
        platforms: platforms,
        game: game,
        errors: errors.array(),
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];
