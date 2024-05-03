const express = require("express");
const router = express.Router();

const game_controller = require("../controllers/gameController");
const genre_controller = require("../controllers/genreController");
const dev_controller = require("../controllers/devController");
// Get catalog home page
router.get("/", game_controller.index);

// Get request for creating a game
router.get("/game/create", game_controller.game_create_get);
// // Post request for creating a game
router.post("/game/create", game_controller.game_create_post);

// // delete game requests
router.get("/game/:id/delete", game_controller.game_delete_get);
router.post("/game/:id/delete", game_controller.game_delete_post);

// // Update game requests
router.get("/game/:id/update", game_controller.game_update_get);
router.post("/game/:id/update", game_controller.game_update_post);

// //
router.get("/games", game_controller.game_list);

// Get game detail
router.get("/game/:id", game_controller.game_detail);
// Developer routes

// // Create developer requests
router.get("/dev/create", dev_controller.dev_create_get);
router.post("/dev/create", dev_controller.dev_create_post);

// // Delete developer requests
router.get("/dev/:id/delete", dev_controller.dev_delete_get);
router.post("/dev/:id/delete", dev_controller.dev_delete_post);
// // Update developer requests
router.get("/dev/:id/update", dev_controller.dev_update_get);
router.post("/dev/:id/update", dev_controller.dev_update_post);
router.get("/devs", dev_controller.dev_list);
router.get("/dev/:id", dev_controller.dev_detail);
// Genre routes

// // Create Genre requests
router.get("/genre/create", genre_controller.genre_create_get);
router.post("/genre/create", genre_controller.genre_create_post);
// // Delete genre requests
router.get("/genre/:id/delete", genre_controller.genre_delete_get);
router.post("/genre/:id/delete", genre_controller.genre_delete_post);
// // Update genre requests
router.get("/genre/:id/update", genre_controller.genre_update_get);
router.post("/genre/:id/update", genre_controller.genre_update_post);
router.get("/genres", genre_controller.genre_list);

router.get("/genre/:id", genre_controller.genre_detail);
module.exports = router;
