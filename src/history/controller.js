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

    create: async (req, res) => {
      try {
        const { menu_id } = req.body;
        if (!menu_id) {
          return res.status(400).json({ error: "menu_id is required" });
        }
        await knex("history").insert({ menu_id });
        res.json({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add history" });
      }
    },
  };
}

module.exports = { initHistoryController };
