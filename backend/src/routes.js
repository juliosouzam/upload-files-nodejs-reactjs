const routes = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { readdir, stat } = require("fs").promises;
const { join } = require("path");

const multerConfig = require("./config/multer");
const sql = require("mssql");
const configDatabase = require("./config/database");

const File = require("./models/File");

routes.get("/files", async (req, res) => {
  const files = await File.find();

  return res.json(files);
});

routes.post("/login", async (req, res) => {
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
  }

  return res.status(400).send({ error: "Invalid username/password" });
});

routes.post(
  "/directories/files",
  multer(multerConfig).single("file"),
  async (req, res) => {
    const {
      originalname: name,
      size,
      key,
      location: url = "",
      directory
    } = req.file;
    const file = await File.create({
      name,
      size,
      key,
      url,
      directory
    });

    return res.json(file);
  }
);

routes.get("/directories/:directory/files", async (req, res) => {
  const { directory } = req.params;
  const posts = await File.find({ directory, deletedAt: null });

  return res.json(posts);
});

routes.post("/directories", async (req, res) => {
  try {
    const { directory } = req.body;

    const relativePath = path.resolve(
      __dirname,
      "..",
      "tmp",
      "uploads",
      directory.toLowerCase()
    );

    if (!fs.existsSync(relativePath)) {
      fs.mkdirSync(relativePath);
    }

    return res.send({ message: `Directory ${directory} created successful!` });
  } catch (error) {
    return res.status(400).send(error);
  }
});

routes.get("/directories", async (req, res) => {
  try {
    let dirs = [];
    const currentDir = path.resolve(process.env.PWD, "tmp", "uploads");
    for (const file of await readdir(currentDir)) {
      if ((await stat(join(currentDir, file))).isDirectory()) {
        dirs = [...dirs, file];
      }
    }
    return res.send({ dirs });
  } catch (error) {
    return res.status(400).send(error);
  }
});

routes.delete("/files/:id", async (req, res) => {
  const file = await File.findById(req.params.id);

  file.deletedAt = Date.now();

  await file.save();

  return res.send();
});

module.exports = routes;
