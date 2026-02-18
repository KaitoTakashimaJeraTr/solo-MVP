/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("menus", (table) => {
    table.increments("id").primary();
    table.integer("total_calories").notNullable();
    table.integer("total_protein").notNullable();
    table.integer("total_fat").notNullable();
    table.integer("total_carbon").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("menus");
};
