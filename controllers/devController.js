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

exports.dev_create_get = (req, res, next) => {
  res.render("dev_form", { title: "Add Developer" });
};

exports.dev_create_post = [
  body("name", "Name must be atleast 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const dev = new Dev({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render("dev_form", {
        title: "Add Developer",
        dev: dev,
        errors: errors.array(),
      });
      return;
    } else {
      const devExists = await Dev.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (devExists) {
        res.redirect(devExists.url);
      } else {
        await dev.save();
        res.redirect(dev.url);
      }
    }
  }),
];
