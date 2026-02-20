import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";

export default function HistoryCalendar() {
  const { get } = useApi();
  const [historyByDate, setHistoryByDate] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // モーダル用 state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // メニュー詳細用 state
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await get("/history");

      const grouped = {};
      data.forEach((item) => {
        const date = item.created_at.slice(0, 10);
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      setHistoryByDate(grouped);
    };

    fetchHistory();
  }, []);

  // 日付クリック時
  const handleDateClick = (dateStr) => {
    if (!historyByDate[dateStr]) return;

    setSelectedDate(dateStr);
    setSelectedItems(historyByDate[dateStr]);
    setSelectedMenuDetail(null);
    setIsModalOpen(true);
  };

  // メニュー詳細取得
  const handleMenuClick = async (menuId) => {
    setIsDetailLoading(true);
    setSelectedMenuDetail(null);

    const data = await get(`/menus/${menuId}`);
    setSelectedMenuDetail(data);

    setIsDetailLoading(false);
  };

  // カレンダー生成
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

  const days = [];
  const startWeekday = firstDay.getDay();

  // 空白セル
  for (let i = 0; i < startWeekday; i++) {
    days.push({ date: null, fullDate: null, items: [], isEmpty: true });
  }

  // 日付セル
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1,
    ).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    days.push({
      date: i,
      fullDate: dateStr,
      items: historyByDate[dateStr] || [],
      isEmpty: false,
    });
  }

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        履歴カレンダー
      </Text>

      {/* 月切り替え */}
      <Box mb={4}>
        <Button
          mr={3}
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
        </Button>

        <Text as="span" mx={4} fontSize="lg">
          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
        </Text>

        <Button
          ml={3}
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
        </Button>
      </Box>

      {/* カレンダー */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={3}>
        {days.map((d, index) => (
          <Box
            key={d.fullDate || `empty-${index}`}
            border="1px solid #ccc"
            borderRadius="md"
            p={3}
            minH="100px"
            bg={
              d.isEmpty ? "gray.100" : d.items.length > 0 ? "blue.50" : "white"
            }
            cursor={!d.isEmpty && d.items.length > 0 ? "pointer" : "default"}
            onClick={() =>
              !d.isEmpty && d.items.length > 0 && handleDateClick(d.fullDate)
            }
          >
            {!d.isEmpty && <strong>{d.date}</strong>}
          </Box>
        ))}
      </Box>

      {/* モーダル */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedMenuDetail
              ? `メニューID: ${selectedMenuDetail.id}`
              : `${selectedDate} の履歴`}
          </ModalHeader>

          <ModalBody>
            {/* ローディング */}
            {isDetailLoading && (
              <Box textAlign="center" py={5}>
                <Spinner size="lg" />
              </Box>
            )}

            {/* メニュー一覧 */}
            {!isDetailLoading && !selectedMenuDetail && (
              <>
                {selectedItems.map((item) => (
                  <Box key={item.id} mb={4}>
                    <Text>
                      メニューID:{" "}
                      <Text
                        as="span"
                        color="blue.600"
                        textDecoration="underline"
                        cursor="pointer"
                        onClick={() => handleMenuClick(item.menu_id)}
                      >
                        {item.menu_id}
                      </Text>
                    </Text>
                    <Text>カロリー: {item.total_calories} kcal</Text>
                  </Box>
                ))}
              </>
            )}

            {/* メニュー詳細 */}
            {!isDetailLoading && selectedMenuDetail && (
              <>
                <Text fontWeight="bold" mb={2}>
                  食品一覧
                </Text>
                <Box mb={4}>
                  {selectedMenuDetail.foods.map((f) => (
                    <Text key={f.id}>
                      {f.name}（{f.calories} kcal / P{f.protein} / F{f.fat} / C
                      {f.carbon}）
                    </Text>
                  ))}
                </Box>

                <Text fontWeight="bold" mb={2}>
                  合計値
                </Text>
                <Box>
                  <Text>カロリー: {selectedMenuDetail.total_calories}</Text>
                  <Text>タンパク質: {selectedMenuDetail.total_protein}</Text>
                  <Text>脂質: {selectedMenuDetail.total_fat}</Text>
                  <Text>炭水化物: {selectedMenuDetail.total_carbon}</Text>
                </Box>

                <Button mt={4} onClick={() => setSelectedMenuDetail(null)}>
                  戻る
                </Button>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
