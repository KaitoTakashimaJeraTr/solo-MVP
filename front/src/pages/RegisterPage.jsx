import { useState } from "react";
import { Box, Input, Button, Heading, VStack } from "@chakra-ui/react";

export default function RegisterPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await res.json();

    if (data.id) {
      alert("登録が完了しました！ログインしてください。");
      setPage("login");
    } else {
      alert("登録に失敗しました");
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="80px">
      <Heading mb="6">新規登録</Heading>

      <VStack spacing="4">
        <Input
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button colorScheme="green" w="100%" onClick={handleRegister}>
          登録
        </Button>
      </VStack>
    </Box>
  );
}
