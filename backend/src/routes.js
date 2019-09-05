const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const FileController = require("./controllers/FileController");
const AuthController = require("./controllers/AuthController");
const DirectoryController = require("./controllers/DirectoryController");

routes.get("/files", FileController.index);

routes.post("/login", AuthController.login);

routes.post(
  "/directories/files",
  multer(multerConfig).single("file"),
  FileController.store
);

routes.get("/directories/:directory/files", FileController.show);

routes.post("/directories", DirectoryController.store);

routes.get("/directories", DirectoryController.index);

routes.delete("/files/:id", FileController.destroy);

module.exports = routes;
