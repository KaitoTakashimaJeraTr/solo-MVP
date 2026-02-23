const path = require("path");
const { buildApp } = require("./app");

const PORT = process.env.PORT || 3000;
const app = buildApp();

// React のビルドファイルを配信
app.use(require("express").static(path.join(__dirname, "../front/dist")));

// すべてのルートで React の index.html を返す
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
