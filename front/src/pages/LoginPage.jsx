import { useState } from "react";
import { Box, Input, Button, Heading, VStack } from "@chakra-ui/react";

export default function LoginPage({ setIsLoggedIn, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

      setIsLoggedIn(true);
      setPage("generate");

      alert("ログイン成功！");
    } else {
      alert("ログイン失敗");
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="80px">
      <Heading mb="6">ログイン</Heading>

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

        <Button colorScheme="blue" w="100%" onClick={handleLogin}>
          ログイン
        </Button>
      </VStack>
    </Box>
  );
}
