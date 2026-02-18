function initHistoryController(knex) {
  return {
    list: async (req, res) => {
      try {
        const history = await knex("history")
          .join("menus", "history.menu_id", "menus.id")
          .select("history.*", "menus.total_calories");

        res.json(history);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch history" });
      }
    },
  };
}

module.exports = { initHistoryController };
