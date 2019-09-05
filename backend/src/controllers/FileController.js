const File = require("./../models/File");

module.exports = {
  async index(req, res) {
    const files = await File.find();

    return res.json(files);
  },
  async store(req, res) {
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
      directory,
      author: req.body.author
    });

    return res.json(file);
  },
  async show(req, res) {
    const { directory } = req.params;
    const posts = await File.find({ directory, deletedAt: null });

    return res.json(posts);
  },
  async destroy(req, res) {
    const file = await File.findById(req.params.id);

    file.deletedAt = Date.now();
    file.authorDeleted = req.body.author;

    await file.save();

    return res.send();
  }
};
