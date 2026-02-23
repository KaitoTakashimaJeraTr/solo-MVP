const express = require("express");
const cors = require("cors");
const knex = require("./knex");
const path = require("path");

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
  app.get("/api/foods", foodsController.list);

  // Menus
  app.get("/api/menus", menusController.list);
  app.get("/api/menus/:id", validateIdMiddleware, menusController.find);
  app.post("/api/menus/generate", menusController.generate);

  // History
  app.get("/api/history", historyController.list);
  app.post("/api/history", historyController.create);

  app.use(express.static(path.join(__dirname, "../front/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../front/dist/index.html"));
  });

  app.use((req, res) => res.status(404).json({ error: "Not Found" }));

  return app;
}

module.exports = { buildApp };
