import "./App.css";
import { useState, useEffect } from "react";
import GenerateMenu from "./pages/GenerateMenu";
import HistoryCalendar from "./pages/HistoryCalender";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Button } from "@chakra-ui/react";

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // ログイン後に /api/auth/me を叩いてユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();
      setUser(data);
      console.log("ログイン中ユーザー:", data);
    };

    fetchUser();
  }, [isLoggedIn]);

  return (
    <div>
      {/* ページ切り替えボタン */}
      <div className="page-switcher">
        <Button colorScheme="gray" onClick={() => setPage("login")}>
          ログイン
        </Button>

        <Button colorScheme="green" onClick={() => setPage("register")}>
          新規登録
        </Button>

        <Button colorScheme="blue" onClick={() => setPage("generate")}>
          メニュー生成
        </Button>

        <Button colorScheme="teal" onClick={() => setPage("history")}>
          履歴カレンダー
        </Button>

        {/* ログアウトボタン（ログイン時のみ表示） */}
        {isLoggedIn && (
          <Button
            colorScheme="red"
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              setUser(null);
              setPage("login");
            }}
          >
            ログアウト
          </Button>
        )}
      </div>

      {/* ページ表示 */}
      {page === "login" && (
        <LoginPage setIsLoggedIn={setIsLoggedIn} setPage={setPage} />
      )}

      {page === "register" && <RegisterPage setPage={setPage} />}

      {/* ログインしていない場合のガード */}
      {!isLoggedIn && page !== "login" && page !== "register" && (
        <div style={{ padding: "20px" }}>ログインしてください</div>
      )}

      {/* ログイン後のページ */}
      {isLoggedIn && page === "generate" && (
        <GenerateMenu key={user?.id} user={user} />
      )}
      {isLoggedIn && page === "history" && (
        <HistoryCalendar key={user?.id} user={user} />
      )}
    </div>
  );
}

export default App;
