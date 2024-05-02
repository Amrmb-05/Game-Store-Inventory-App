const Dev = require("../models/developer");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.dev_list = asyncHandler(async (req, res, next) => {
  const devs = await Dev.find({}).sort({ name: 1 }).exec();

  res.render("dev_list", { title: "Developers", devs: devs });
});

exports.dev_detail = asyncHandler(async (req, res, next) => {
  const [dev, dev_games] = await Promise.all([
    Dev.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }).sort({ title: 1 }).exec(),
  ]);

  if (dev === null) {
    const err = new Error("Developer not found");
    err.status = 404;
    return next(err);
  }

  res.render("dev_detail", { dev: dev, dev_games: dev_games });
});
