import "./App.css";
import { useState } from "react";
import GenerateMenu from "./pages/GenerateMenu";
import HistoryCalendar from "./pages/HistoryCalender";
import { Button } from "@chakra-ui/react";

function App() {
  const [page, setPage] = useState("generate");

  return (
    <div>
      <div className="page-switcher">
        <Button colorScheme="blue" onClick={() => setPage("generate")}>
          メニュー生成
        </Button>
        <Button colorScheme="teal" onClick={() => setPage("history")}>
          履歴カレンダー
        </Button>
      </div>

      {page === "generate" && <GenerateMenu />}
      {page === "history" && <HistoryCalendar />}
    </div>
  );
}

export default App;
