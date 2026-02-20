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

        const foods = await knex("menu_items")
          .where({ menu_id: req.params.id })
          .join("foods", "menu_items.food_id", "foods.id")
          .select(
            "foods.id",
            "foods.name",
            "foods.calories",
            "foods.protein",
            "foods.fat",
            "foods.carbon",
          );

        res.json({
          id: menu.id,
          foods,
          total_calories: menu.total_calories,
          total_protein: menu.total_protein,
          total_fat: menu.total_fat,
          total_carbon: menu.total_carbon,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch menu" });
      }
    },

    generate: async (req, res) => {
      const targetCalories = Number(req.body.targetCalories);

      const maxFat =
        req.body.maxFat === "" || req.body.maxFat === null
          ? null
          : Number(req.body.maxFat);

      const maxCarbon =
        req.body.maxCarbon === "" || req.body.maxCarbon === null
          ? null
          : Number(req.body.maxCarbon);

      const minProtein =
        req.body.minProtein === "" || req.body.minProtein === null
          ? null
          : Number(req.body.minProtein);

      try {
        const foods = await knex("foods").select("*");

        let selected = [];
        let totalCalories = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbon = 0;

        let safety = 0;
        const MAX_LOOP = 5000;

        while (true) {
          safety++;
          if (safety > MAX_LOOP) {
            return res.status(400).json({
              error:
                "条件に合うメニューが見つかりませんでした（上限回数に達しました）",
            });
          }

          const randomFood = foods[Math.floor(Math.random() * foods.length)];
          selected.push(randomFood);

          // 合計値を更新
          totalCalories += randomFood.calories;
          totalProtein += randomFood.protein;
          totalFat += randomFood.fat;
          totalCarbon += randomFood.carbon;

          // カロリーが上限を超えたら即やり直し
          if (totalCalories > targetCalories) {
            // リセットして再挑戦
            selected = [];
            totalCalories = 0;
            totalProtein = 0;
            totalFat = 0;
            totalCarbon = 0;
            continue;
          }

          // 他の条件をチェック
          if (maxFat !== null && totalFat > maxFat) continue;
          if (maxCarbon !== null && totalCarbon > maxCarbon) continue;
          if (minProtein !== null && totalProtein < minProtein) continue;

          // すべての条件を満たしたら終了
          break;
        }

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
