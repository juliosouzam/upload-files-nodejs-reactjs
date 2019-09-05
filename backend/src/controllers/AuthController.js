const crypto = require("crypto");
const sql = require("mssql");
const configDatabase = require("./../config/database");

module.exports = {
  async login(req, res) {
    const { login, senha } = req.body;

    let hash = crypto
      .createHash("md5")
      .update(senha)
      .digest("hex");

    try {
      let pool = await sql.connect(configDatabase);
      let result = await pool
        .request()
        .input("login_parameter", sql.VarChar, login)
        .input("senha_parameter", sql.VarChar, hash)
        .query(
          "SELECT * FROM tbl_usuario WHERE login = @login_parameter AND senha = @senha_parameter"
        );

      const { recordset: user } = result;

      user[0].senha = undefined;

      sql.close();

      return res.send(user);
    } catch (err) {
      console.warn(err);

      return res.status(400).send({ error: "Invalid username/password" });
    }
  }
};
