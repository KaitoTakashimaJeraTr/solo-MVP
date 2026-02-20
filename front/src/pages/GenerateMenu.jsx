import { useState } from "react";
import { useApi } from "../hooks/useApi";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

export default function GenerateMenu() {
  // 入力値 state
  const [targetCalories, setTargetCalories] = useState("");
  const [maxFat, setMaxFat] = useState("");
  const [maxCarbon, setMaxCarbon] = useState("");
  const [minProtein, setMinProtein] = useState("");
  const [result, setResult] = useState(null);

  // エラー state
  const [calorieError, setCalorieError] = useState("");
  const [fatError, setFatError] = useState("");
  const [carbonError, setCarbonError] = useState("");
  const [proteinError, setProteinError] = useState("");

  // モーダル state
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [infoHeader, setInfoHeader] = useState("");

  const { post } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    // --- カロリー ---
    if (!targetCalories) {
      setCalorieError("カロリー上限は必須です");
      hasError = true;
    } else if (Number(targetCalories) <= 0) {
      setCalorieError("1 以上の数値を入力してください");
      hasError = true;
    } else {
      setCalorieError("");
    }

    // --- 脂質 ---
    if (maxFat !== "" && Number(maxFat) <= 0) {
      setFatError("1 以上の数値を入力してください");
      hasError = true;
    } else {
      setFatError("");
    }

    // --- 炭水化物 ---
    if (maxCarbon !== "" && Number(maxCarbon) <= 0) {
      setCarbonError("1 以上の数値を入力してください");
      hasError = true;
    } else {
      setCarbonError("");
    }

    // --- タンパク質 ---
    if (minProtein !== "" && Number(minProtein) <= 0) {
      setProteinError("1 以上の数値を入力してください");
      hasError = true;
    } else {
      setProteinError("");
    }

    // エラーがあれば API を呼ばない
    if (hasError) return;

    // --- API 呼び出し ---
    const data = await post("/menus/generate", {
      targetCalories: Number(targetCalories),
      maxFat: maxFat ? Number(maxFat) : null,
      maxCarbon: maxCarbon ? Number(maxCarbon) : null,
      minProtein: minProtein ? Number(minProtein) : null,
    });

    // 組み合わせが存在しない場合
    if (!data || !data.foods || data.foods.length === 0) {
      setInfoHeader("Error");
      setInfoMessage("この条件を満たす組み合わせは存在しません");
      setInfoModalOpen(true);
      return;
    }

    setResult(data);
  };

  const handleAccept = async () => {
    if (!result) return;

    await post("/history", {
      menu_id: result.menuId.id || result.menuId,
    });

    setInfoHeader("Accept");
    setInfoMessage("履歴に追加しました！");
    setInfoModalOpen(true);
  };

  const handleRegenerate = async () => {
    setResult(null);

    const data = await post("/menus/generate", {
      targetCalories: Number(targetCalories),
      maxFat: maxFat === "" ? null : Number(maxFat),
      maxCarbon: maxCarbon === "" ? null : Number(maxCarbon),
      minProtein: minProtein === "" ? null : Number(minProtein),
    });

    if (!data || !data.foods || data.foods.length === 0) {
      setInfoMessage("この条件を満たす組み合わせは存在しません");
      setInfoModalOpen(true);
      return;
    }

    setResult(data);
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        おまかせごはん
      </Text>

      {/* フォーム */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        border="1px solid #ddd"
        borderRadius="md"
        p={4}
        mb={6}
        bg="gray.50"
        maxW="500px"
        mx="auto"
        mt={6}
      >
        {/* カロリー上限 */}
        <FormControl mb={4} isRequired isInvalid={calorieError !== ""}>
          <FormLabel>カロリー上限</FormLabel>
          <Input
            type="number"
            placeholder="例: 600"
            value={targetCalories}
            onChange={(e) => setTargetCalories(e.target.value)}
          />
          <FormErrorMessage>{calorieError}</FormErrorMessage>
        </FormControl>

        <Divider my={4} />

        <Text fontWeight="bold" mb={3}>
          栄養素の条件（任意）
        </Text>

        {/* 脂質 */}
        <FormControl mb={3} isInvalid={fatError !== ""}>
          <FormLabel>脂質上限</FormLabel>
          <Input
            type="number"
            placeholder="例: 20"
            value={maxFat}
            onChange={(e) => setMaxFat(e.target.value)}
          />
          <FormErrorMessage>{fatError}</FormErrorMessage>
        </FormControl>

        {/* 炭水化物 */}
        <FormControl mb={3} isInvalid={carbonError !== ""}>
          <FormLabel>炭水化物上限</FormLabel>
          <Input
            type="number"
            placeholder="例: 60"
            value={maxCarbon}
            onChange={(e) => setMaxCarbon(e.target.value)}
          />
          <FormErrorMessage>{carbonError}</FormErrorMessage>
        </FormControl>

        {/* タンパク質 */}
        <FormControl mb={3} isInvalid={proteinError !== ""}>
          <FormLabel>タンパク質下限</FormLabel>
          <Input
            type="number"
            placeholder="例: 30"
            value={minProtein}
            onChange={(e) => setMinProtein(e.target.value)}
          />
          <FormErrorMessage>{proteinError}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" mt={4} width="100%">
          生成する
        </Button>
      </Box>

      {/* 結果表示 */}
      {result && (
        <Box
          border="1px solid #ddd"
          borderRadius="md"
          p={4}
          bg="white"
          maxW="500px"
          mx="auto"
          mt={6}
        >
          <Text fontSize="xl" mb={3}>
            選ばれた食事内容
          </Text>

          <Box mb={4}>
            {result.foods.map((f) => (
              <Text key={f.id}>
                {f.name}（{f.calories} kcal / P{f.protein} / F{f.fat} / C
                {f.carbon}）
              </Text>
            ))}
          </Box>

          <Text fontWeight="bold" mb={2}>
            合計値
          </Text>
          <Box mb={4}>
            <Text>カロリー: {result.totals.calories} kcal</Text>
            <Text>タンパク質: {result.totals.protein} g</Text>
            <Text>脂質: {result.totals.fat} g</Text>
            <Text>炭水化物: {result.totals.carbon} g</Text>
          </Box>

          <Button colorScheme="green" mr={3} onClick={handleAccept}>
            決定
          </Button>
          <Button colorScheme="orange" onClick={handleRegenerate}>
            再生成
          </Button>
        </Box>
      )}

      {/* 通知モーダル */}
      <Modal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{infoHeader}</ModalHeader>
          <ModalBody>
            <Text>{infoMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setInfoModalOpen(false)}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
