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

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_form", { title: "Update Genre", genre: genre });
});

exports.genre_update_post = [
  body("name", "name must be more than 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
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
        await Genre.findByIdAndUpdate(req.params.id, genre);
        res.redirect(genre.url);
      }
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (genre === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }
  res.render("genre_delete", { title: "Delete Genre", genre: genre });
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (genre === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  if (req.body.password === "amr3") {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  } else {
    res.render("genre_delete", {
      title: "Delete genre",
      genre: genre,
      password: "Incorrect Password",
    });
  }
});
