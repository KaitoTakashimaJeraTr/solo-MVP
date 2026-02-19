import { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function GenerateMenu() {
  const [targetCalories, setTargetCalories] = useState("");
  const [maxFat, setMaxFat] = useState("");
  const [maxCarbon, setMaxCarbon] = useState("");
  const [minProtein, setMinProtein] = useState("");
  const [result, setResult] = useState(null);

  const { post } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await post("/menus/generate", {
      targetCalories: Number(targetCalories),
      maxFat: maxFat ? Number(maxFat) : null,
      maxCarbon: maxCarbon ? Number(maxCarbon) : null,
      minProtein: minProtein ? Number(minProtein) : null,
    });

    setResult(data);
  };

  const handleAccept = async () => {
    if (!result) return;
    await post("/history", {
      menu_id: result.menuId.id || result.menuId,
    });
    alert("履歴に追加しました！");
  };

  const handleRegenerate = async () => {
    const data = await post("/menus/generate", {
      targetCalories: Number(targetCalories),
      maxFat: Number(maxFat),
    });
    setResult(data);
  };

  return (
    <div>
      <h1>メニュー自動生成</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>カロリー上限：</label>
          <input
            type="number"
            value={targetCalories}
            onChange={(e) => setTargetCalories(e.target.value)}
          />
        </div>

        <div>
          <label>脂質上限：</label>
          <input
            type="number"
            value={maxFat}
            onChange={(e) => setMaxFat(e.target.value)}
          />
        </div>

        <div>
          <label>炭水化物上限：</label>
          <input
            type="number"
            value={maxCarbon}
            onChange={(e) => setMaxCarbon(e.target.value)}
          />
        </div>

        <div>
          <label>タンパク質下限：</label>
          <input
            type="number"
            value={minProtein}
            onChange={(e) => setMinProtein(e.target.value)}
          />
        </div>

        <button type="submit">生成する</button>
      </form>

      {result && (
        <div>
          <h2>選ばれた食品</h2>
          <ul>
            {result.foods.map((f) => (
              <li key={f.id}>
                {f.name}（{f.calories} kcal / fat {f.fat}g / protein {f.protein}
                g / carbon {f.carbon}g）
              </li>
            ))}
          </ul>
          <h3>合計値</h3>
          <ul>
            <li>カロリー: {result.totals.calories} kcal</li>
            <li>タンパク質: {result.totals.protein} g</li>
            <li>脂質: {result.totals.fat} g</li>
            <li>炭水化物: {result.totals.carbon} g</li>
          </ul>
          <button onClick={handleAccept}>Accept</button>
          <button onClick={handleRegenerate}>Regenerate</button>
        </div>
      )}
    </div>
  );
}
