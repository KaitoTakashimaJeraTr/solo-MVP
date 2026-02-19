const express = require("express");
const cors = require("cors");
const knex = require("./knex");

const { initFoods } = require("./foods");
const { initMenus } = require("./menus");
const { initHistory } = require("./history");

function buildApp() {
  const app = express();

  // cors起動
  // React(5173) → Express(3000) を許可するために必要
  app.use(cors());

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
  app.post("/history", historyController.create);

  app.use((req, res) => res.status(404).json({ error: "Not Found" }));

  return app;
}

module.exports = { buildApp };
