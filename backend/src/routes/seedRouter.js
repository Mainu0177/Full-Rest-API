const { seedUser, seedProducts } = require("../controllers/seedController");

const seedRouter = require("express").Router();



seedRouter.get("/users", seedUser);
seedRouter.get('/products', seedProducts)

module.exports = seedRouter;