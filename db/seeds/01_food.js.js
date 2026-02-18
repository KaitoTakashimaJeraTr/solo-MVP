/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("foods").del();
  await knex("foods").insert([
    {
      id: 1,
      name: "ご飯",
      calories: 250,
      protein: 4,
      fat: 1,
      carbon: 55,
    },
    {
      id: 2,
      name: "鶏むね肉（100g）",
      calories: 200,
      protein: 22,
      fat: 3,
      carbon: 0,
    },
    {
      id: 3,
      name: "サラダ",
      calories: 50,
      protein: 1,
      fat: 0,
      carbon: 10,
    },
    {
      id: 4,
      name: "味噌汁",
      calories: 40,
      protein: 3,
      fat: 1,
      carbon: 5,
    },
    {
      id: 5,
      name: "卵焼き",
      calories: 120,
      protein: 7,
      fat: 8,
      carbon: 6,
    },
  ]);
};
