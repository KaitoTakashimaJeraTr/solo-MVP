import { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function GenerateMenu() {
  const [targetCalories, setTargetCalories] = useState("");
  const [maxFat, setMaxFat] = useState("");
  const [result, setResult] = useState(null);

  const { post } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await post("/menus/generate", {
      targetCalories: Number(targetCalories),
      maxFat: Number(maxFat),
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

        <button type="submit">生成する</button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>生成結果</h2>
          <p>メニューID: {result.menuId.id || result.menuId}</p>

          <h3>選ばれた食品</h3>
          <ul>
            {result.foods.map((f) => (
              <li key={f.id}>
                {f.name}（{f.calories} kcal / fat {f.fat}g）
              </li>
            ))}
          </ul>
          <button onClick={handleAccept}>Accept</button>
          <button onClick={handleRegenerate}>Regenerate</button>
        </div>
      )}
    </div>
  );
}
