const { initMenusController } = require("./controller");

function initMenus(knex) {
  const controller = initMenusController(knex);

  return {
    list: controller.list,
    find: controller.find,
    generate: controller.generate,
  };
}

module.exports = { initMenus };
