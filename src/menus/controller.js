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
      const maxFat = req.body.maxFat ? Number(req.body.maxFat) : null;
      const maxCarbon = req.body.maxCarbon ? Number(req.body.maxCarbon) : null;
      const minProtein = req.body.minProtein
        ? Number(req.body.minProtein)
        : null;

      try {
        const foods = await knex("foods").select("*");

        let selected = [];
        let totalCalories = Infinity;
        let totalFat = Infinity;
        let totalCarbon = Infinity;
        let totalProtein = -Infinity;

        //条件を満たすまでループ
        let safety = 0;
        while (true) {
          safety++;
          if (safety > 10) {
            return res.status(400).json({
              error: "条件に合うメニューが見つかりませんでした",
            });
          }

          // ランダムに3つ選ぶ
          selected = [];
          for (let i = 0; i < 3; i++) {
            const randomFood = foods[Math.floor(Math.random() * foods.length)];
            selected.push(randomFood);
          }

          // 合計値計算
          totalCalories = selected.reduce((sum, f) => sum + f.calories, 0);
          totalProtein = selected.reduce((sum, f) => sum + f.protein, 0);
          totalFat = selected.reduce((sum, f) => sum + f.fat, 0);
          totalCarbon = selected.reduce((sum, f) => sum + f.carbon, 0);

          // ★ 条件チェック
          if (totalCalories > targetCalories) continue;
          if (maxFat !== null && totalFat > maxFat) continue;
          if (maxCarbon !== null && totalCarbon > maxCarbon) continue;
          if (minProtein !== null && totalProtein < minProtein) continue;

          // 条件を満たしたら break
          break;
        }

        // メニュー保存
        const [menuId] = await knex("menus")
          .insert({
            total_calories: totalCalories,
            total_protein: totalProtein,
            total_fat: totalFat,
            total_carbon: totalCarbon,
          })
          .returning("id");

        for (const food of selected) {
          await knex("menu_items").insert({
            menu_id: menuId.id || menuId,
            food_id: food.id,
          });
        }

        res.json({
          menuId,
          foods: selected,
          totals: {
            calories: totalCalories,
            protein: totalProtein,
            fat: totalFat,
            carbon: totalCarbon,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate menu" });
      }
    },
  };
}

module.exports = { initMenusController };
