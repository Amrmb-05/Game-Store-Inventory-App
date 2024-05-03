const Genre = require("../models/genre");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find({}).sort({ name: 1 }).exec();
  res.render("genre_list", { title: "Genres", genres: genres });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();
  const genre_games = await Game.find(
    { genre: req.params.id },
    "title description",
  )
    .sort({ title: 1 })
    .exec();

  res.render("genre_detail", { genre: genre, genre_games: genre_games });
});

exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Add Genre" });
};

exports.genre_create_post = [
  body("name", "name must be more than 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      req.render("genre_form", {
        title: "Add Genre",
        genre: genre,
        errors: errors.array(),
      });
    } else {
      // Check if genre exists
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];
