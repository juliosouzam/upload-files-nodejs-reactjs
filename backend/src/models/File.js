const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const FileSchema = new mongoose.Schema(
  {
    name: String,
    size: Number,
    key: String,
    url: String,
    directory: String,
    deletedAt: {
      type: Date,
      default: null,
      required: false
    }
  },
  {
    timestamps: true
  }
);

FileSchema.pre("save", function() {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.directory}/${this.key}`;
  }
});

FileSchema.pre("remove", function() {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: this.key
      })
      .promise();
  }

  return promisify(
    fs.unlink
  )(path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key));
});

module.exports = mongoose.model("File", FileSchema);
