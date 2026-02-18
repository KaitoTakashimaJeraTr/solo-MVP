const { initHistoryController } = require("./controller");

function initHistory(knex) {
  const controller = initHistoryController(knex);

  return {
    list: controller.list,
  };
}

module.exports = { initHistory };
