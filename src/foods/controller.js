function initFoodsController(knex) {
  return {
    list: async (req, res) => {
      try {
        const foods = await knex("foods").select("*");
        res.json(foods);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch foods" });
      }
    },
  };
}

module.exports = { initFoodsController };
