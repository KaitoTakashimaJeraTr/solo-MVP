const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
