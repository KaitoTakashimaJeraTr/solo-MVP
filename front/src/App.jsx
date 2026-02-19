import "./App.css";
import { useState } from "react";
import GenerateMenu from "./pages/GenerateMenu";
import HistoryCalendar from "./pages/HistoryCalender";

function App() {
  const [page, setPage] = useState("generate");

  return (
    <div>
      <div>
        <button onClick={() => setPage("generate")}>メニュー生成</button>
        <button onClick={() => setPage("history")}>履歴カレンダー</button>
      </div>

      {page === "generate" && <GenerateMenu />}
      {page === "history" && <HistoryCalendar />}
    </div>
  );
}

export default App;
