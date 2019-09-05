const fs = require("fs");
const { join } = require("path");
const { readdir, stat } = require("fs").promises;
const path = require("path");

module.exports = {
  async index(req, res) {
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
  },
  async store(req, res) {
    try {
      const { directory } = req.body;

      const relativePath = path.resolve(
        __dirname,
        "..",
        "..",
        "tmp",
        "uploads",
        directory.toLowerCase()
      );
      console.log(relativePath)

      if (!fs.existsSync(relativePath)) {
        fs.mkdirSync(relativePath);
      }

      return res.send({
        message: `Directory ${directory} created successful!`
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};
