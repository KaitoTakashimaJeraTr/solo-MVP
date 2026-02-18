/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("foods", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("calories").notNullable();
    table.integer("protein").notNullable();
    table.integer("fat").notNullable();
    table.integer("carbon").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("foods");
};
