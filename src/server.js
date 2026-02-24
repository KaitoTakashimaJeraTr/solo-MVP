require("dotenv").config();

const path = require("path");
const express = require("express");
const { buildApp } = require("./app");

const PORT = process.env.PORT || 3000;
const app = buildApp();

// React のビルドファイルを配信
app.use(express.static(path.join(__dirname, "../front/dist")));

// すべてのルートで React の index.html を返す（正規表現版）
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../front/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
