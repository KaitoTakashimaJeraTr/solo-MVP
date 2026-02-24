const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function initAuth(knex) {
  return {
    // 新規登録
    register: async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // すでに登録済みかチェック
      const exists = await knex("users").where({ email }).first();
      if (exists) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // パスワードをハッシュ化
      const hash = await bcrypt.hash(password, 10);

      const [user] = await knex("users")
        .insert({ email, password_hash: hash })
        .returning(["id", "email"]);

      res.json(user);
    },

    // ログイン
    login: async (req, res) => {
      const { email, password } = req.body;

      const user = await knex("users").where({ email }).first();
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // JWT を発行
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.json({ token });
    },

    // ログイン中ユーザー情報
    me: async (req, res) => {
      res.json(req.user);
    },
  };
}

module.exports = { initAuth };
