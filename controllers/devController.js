const Dev = require("../models/developer");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.dev_list = asyncHandler(async (req, res, next) => {
  const devs = await Dev.find({}).sort({ name: 1 }).exec();

  res.render("dev_list", { title: "Developers", devs: devs });
});
