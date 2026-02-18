const express = require("express");
const knex = require("./knex");

const { initFoods } = require("./foods");
const { initMenus } = require("./menus");
const { initHistory } = require("./history");

function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const foodsController = initFoods(knex);
  const menusController = initMenus(knex);
  const historyController = initHistory(knex);

  function validateIdMiddleware(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: `Invalid id parameter. Instead received "${req.params.id}"`,
      });
    }
    next();
  }

  // Foods
  app.get("/foods", foodsController.list);

  // Menus
  app.get("/menus", menusController.list);
  app.get("/menus/:id", validateIdMiddleware, menusController.find);
  app.post("/menus/generate", menusController.generate);

  // History
  app.get("/history", historyController.list);

  app.use((req, res) => res.status(404).json({ error: "Not Found" }));

  return app;
}

module.exports = { buildApp };
