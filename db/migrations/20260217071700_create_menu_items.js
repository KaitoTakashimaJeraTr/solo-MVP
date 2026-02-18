/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("menu_items", (table) => {
    table.increments("id").primary();
    table
      .integer("food_id")
      .unsigned()
      .references("id")
      .inTable("foods")
      .onDelete("CASCADE");
    table
      .integer("menu_id")
      .unsigned()
      .references("id")
      .inTable("menus")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("menu_items");
};
