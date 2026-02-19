import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

export default function HistoryCalendar() {
  const { get } = useApi();
  const [historyByDate, setHistoryByDate] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await get("/history");

      // 日付ごとにグループ化
      const grouped = {};
      data.forEach((item) => {
        const date = item.created_at.slice(0, 10); // "2026-02-18"
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      setHistoryByDate(grouped);
    };

    fetchHistory();
  }, []);

  // 月の最初と最後
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );
  const lastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  );

  // カレンダー用の日付配列
  const days = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1,
    ).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    days.push({
      date: i,
      fullDate: dateStr,
      items: historyByDate[dateStr] || [],
    });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>履歴カレンダー</h1>

      {/* 月切り替え */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
              ),
            )
          }
        >
          ← 前の月
        </button>

        <span style={{ margin: "0 20px" }}>
          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
        </span>

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
              ),
            )
          }
        >
          次の月 →
        </button>
      </div>

      {/* カレンダー本体 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
        }}
      >
        {days.map((d) => (
          <div
            key={d.fullDate}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              minHeight: "100px",
              background: d.items.length > 0 ? "#e6f7ff" : "white",
            }}
          >
            <strong>{d.date}</strong>

            {/* 各日の履歴を表示 */}
            {d.items.length > 0 && (
              <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                {d.items.map((item) => (
                  <li key={item.id}>
                    {item.total_calories} kcal （menu_id: {item.menu_id}）
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
