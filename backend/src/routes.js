const routes = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");
const multerConfig = require("./config/multer");

const Post = require("./models/Post");

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
});

routes.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username == "admin" && password == "admin") {
    return crypto.randomBytes(16, (err, hash, cb) => {
      if (err) cb(err);
      return res.send({ hash: hash.toString("hex") });
    });
  }

  return res.status(400).send({ error: "Invalid username/password" });
});

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  const { originalname: name, size, key, location: url = "" } = req.file;
  const post = await Post.create({
    name,
    size,
    key,
    url
  });
  return res.json(post);
});

routes.delete("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

module.exports = routes;
