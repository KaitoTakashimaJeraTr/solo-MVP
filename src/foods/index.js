const { initFoodsController } = require("./controller");

function initFoods(knex) {
  const controller = initFoodsController(knex);

  return {
    list: controller.list,
  };
}

module.exports = { initFoods };
