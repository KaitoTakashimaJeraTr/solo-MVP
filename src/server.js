const path = require("path");
const express = require("express");
const { buildApp } = require("./app");

const PORT = process.env.PORT || 3000;
const app = buildApp();

app.use(express.static(path.join(__dirname, "../front/dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
