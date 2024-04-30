#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Developer = require("./models/developer");
const Genre = require("./models/genre");

const genres = [];
const devs = [];
const games = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createDevs();
  await createGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function devCreate(index, name) {
  const devdetail = { name };

  const dev = new Developer(name);

  await dev.save();
  devs[index] = dev;
  console.log(`Added dev: ${name}`);
}

async function gameCreate(
  index,
  title,
  description,
  price,
  inStock,
  developer,
  genre,
  platform,
) {
  const gamedetail = {
    title: title,
    description: description,
    price: price,
    inStock: inStock,
    developer: developer,
    genre: genre,
    platform: platform,
  };
  if (genre != false) bookdetail.genre = genre;

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

// async function bookInstanceCreate(index, book, imprint, due_back, status) {
//   const bookinstancedetail = {
//     book: book,
//     imprint: imprint,
//   };
//   if (due_back != false) bookinstancedetail.due_back = due_back;
//   if (status != false) bookinstancedetail.status = status;

//   const bookinstance = new BookInstance(bookinstancedetail);
//   await bookinstance.save();
//   bookinstances[index] = bookinstance;
//   console.log(`Added bookinstance: ${imprint}`);
// }

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "RPG"),
    genreCreate(1, "Souls-like"),
    genreCreate(2, "Open World"),
    genreCreate(3, "Fighting"),
    genreCreate(4, "Survival"),
  ]);
}

async function createDevs() {
  console.log("Adding devs");
  await Promise.all([
    devCreate(0, "From Software"),
    devCreate(1, "Rockstar Games"),
    devCreate(2, "Guerilla Games"),
    devCreate(3, "Square Enix"),
    devCreate(4, "Insomniac Games"),
  ]);
}
// title: title,
//     description: description,
//     price: price,
//     inStock: inStock,
//     developer: developer,
//     genre: genre,
//     platform: platform,
async function createGames() {
  console.log("Adding games");
  await Promise.all([
    gameCreate(
      0,
      "Elden Ring",
      "Elden Ring takes place in the Lands Between, a fictional realm over which several demigods rule. It was previously ruled over by the immortal Queen Marika, who acted as keeper of the Elden Ring, a powerful force that manifested itself as the physical concept of order. When Marika shattered the Elden Ring and disappeared, her demigod children began fighting over pieces of the Ring in an event called The Shattering. Each demigod has a shard of the Ring called a Great Rune, which corrupts them with power. In the game, the player character is a Tarnished, one of a group of exiles from the Lands Between who are summoned back after the Shattering. The player must traverse the realm to repair the Elden Ring and become the Elden Lord.",
      59.99,
      5,
      devs[0],
      [genres[0], genres[1], genres[2]],
      ["PS5", "PS4", "Xbox Series X", "Xbox One", "Windows"],
    ),
    gameCreate(
      1,
      "Red Dead Redemption",
      "The world of Red Dead Redemption 2 spans five fictitious U.S. states: New Hanover, Ambarino, and Lemoyne are located to the immediate north and east of New Austin and West Elizabeth, which return from Red Dead Redemption.Ambarino is a mountain wilderness, with the largest settlement being the Wapiti Native American reservation;[29] New Hanover encompasses a sweeping valley and woody foothills that feature the cattle town of Valentine, the riverside Van Horn Trading Post, and the coal town of Annesburg;[30][31] and Lemoyne is composed of bayous and plantations resembling the Southeastern United States, and is home to the Southern town of Rhodes, the village of Lagras,[31] and the former French colony of Saint Denis, analogous to New Orleans.[28] West Elizabeth consists of wide plains, dense forests, and the prosperous port town of Blackwater;[10] the region is expanded from the original game with a northern portion containing the mountain resort town of Strawberry. New Austin is an arid desert region on the border with Mexico and centered on the frontier towns of Armadillo and Tumbleweed, featured in the original game.[33] Parts of New Austin and West Elizabeth were redesigned to reflect the earlier time: Blackwater is under development, while Armadillo is a ghost town as a result of a cholera outbreak.",
      39.99,
      13,
      devs[1],
      [genres[0], genres[2]],
      ["PS5", "PS4", "Xbox Series X", "Xbox One", "Windows"],
    ),
    gameCreate(
      2,
      "Final Fantasy 16",
      "Final Fantasy XVI is set in the fictional world of Valisthea. Scattered throughout the two continents of Ash and Storm are colossal magical crystals, known as the Mothercrystals, which provide aether energy to the various populations and drive civilization with shards mined for commercial use. There are also humans that can use magic without crystals known as Bearers who are subject to prejudice and slavery, their overuse causing them to gradually petrify. A powerful force in Valisthea are the Eikons, magical creatures of incredible power that are utilized by hosts called Dominants. There are eight Eikons, one for each of the elements - Phoenix (fire), Shiva (ice), Ramuh (thunder), Leviathan (water), Titan (earth), Garuda (wind), Odin (darkness), and Bahamut (light); a seemingly impossible second Eikon of fire, Ifrit, drives the main plot by disrupting this balance.",
      69.99,
      21,
      devs[3],
      [genres[0], genres[2]],
      ["PS5", "Windows"],
    ),
    gameCreate(
      3,
      "Horizon Zero Dawn",
      "The story is set in a post-apocalyptic United States, between the states of Colorado, Wyoming, and Utah, in the 31st century. Humans live in scattered, primitive tribes with varying levels of technological development. Their technologically advanced predecessors are remembered as the Old Ones. Large robotic machines dominate the Earth. For the most part, they peacefully coexist with humans, who occasionally hunt them for parts. However, a phenomenon known as the Derangement has caused machines to become more aggressive toward humans, and larger and deadlier machines have begun to appear. Four tribes are prominently featured: the Nora, the Banuk, the Carja, and the Oseram. The Nora are fierce matriarchal hunter-gatherers who live in the mountains and worship their deity, the All-Mother.The Carja are an empire of desert-dwelling city builders who worship the Sun. The Banuk consists of wandering clans made up of hunters and shamans who live in snowy mountains (Wyoming's Yellowstone National Park) and worship the blue light of the machines. The Oseram are tinkerers and salvagers known for their advanced weapons, metalworking, brewing, and talent as warriors.",
      19.99,
      2,
      devs[2],
      [genres[0], genres[2]],
      ["PS5", "PS4", "Windows"],
    ),
  ]);
}

// async function createBookInstances() {
//   console.log("Adding authors");
//   await Promise.all([
//     bookInstanceCreate(
//       0,
//       books[0],
//       "London Gollancz, 2014.",
//       false,
//       "Available",
//     ),
//     bookInstanceCreate(1, books[1], " Gollancz, 2011.", false, "Loaned"),
//     bookInstanceCreate(2, books[2], " Gollancz, 2015.", false, false),
//     bookInstanceCreate(
//       3,
//       books[3],
//       "New York Tom Doherty Associates, 2016.",
//       false,
//       "Available",
//     ),
//     bookInstanceCreate(
//       4,
//       books[3],
//       "New York Tom Doherty Associates, 2016.",
//       false,
//       "Available",
//     ),
//     bookInstanceCreate(
//       5,
//       books[3],
//       "New York Tom Doherty Associates, 2016.",
//       false,
//       "Available",
//     ),
//     bookInstanceCreate(
//       6,
//       books[4],
//       "New York, NY Tom Doherty Associates, LLC, 2015.",
//       false,
//       "Available",
//     ),
//     bookInstanceCreate(
//       7,
//       books[4],
//       "New York, NY Tom Doherty Associates, LLC, 2015.",
//       false,
//       "Maintenance",
//     ),
//     bookInstanceCreate(
//       8,
//       books[4],
//       "New York, NY Tom Doherty Associates, LLC, 2015.",
//       false,
//       "Loaned",
//     ),
//     bookInstanceCreate(9, books[0], "Imprint XXX2", false, false),
//     bookInstanceCreate(10, books[1], "Imprint XXX3", false, false),
//   ]);
// }
