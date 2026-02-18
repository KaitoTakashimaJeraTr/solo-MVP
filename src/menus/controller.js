function initMenusController(knex) {
  return {
    list: async (req, res) => {
      try {
        const menus = await knex("menus").select("*");
        res.json(menus);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch menus" });
      }
    },

    find: async (req, res) => {
      try {
        const menu = await knex("menus").where({ id: req.params.id }).first();
        if (!menu) return res.status(404).json({ error: "Menu not found" });

        const items = await knex("menu_items")
          .where({ menu_id: req.params.id })
          .join("foods", "menu_items.food_id", "foods.id")
          .select("foods.*");

        res.json({ ...menu, items });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch menu" });
      }
    },

    generate: async (req, res) => {
      const targetCalories = Number(req.body.targetCalories);

      try {
        const foods = await knex("foods")
          .where("calories", "<=", targetCalories)
          .limit(3);

        if (foods.length === 0) {
          return res.status(400).json({
            error: "条件に合う食品がありません",
          });
        }

        const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
        const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
        const totalFat = foods.reduce((sum, f) => sum + f.fat, 0);
        const totalCarbon = foods.reduce((sum, f) => sum + f.carbon, 0);

        const [menuId] = await knex("menus")
          .insert({
            total_calories: totalCalories,
            total_protein: totalProtein,
            total_fat: totalFat,
            total_carbon: totalCarbon,
          })
          .returning("id");

        for (const food of foods) {
          await knex("menu_items").insert({
            menu_id: menuId.id || menuId,
            food_id: food.id,
          });
        }

        await knex("history").insert({
          menu_id: menuId.id || menuId,
        });

        res.json({ menuId, foods });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate menu" });
      }
    },
  };
}

module.exports = { initMenusController };
