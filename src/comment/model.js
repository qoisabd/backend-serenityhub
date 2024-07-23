const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const commentSchema = Schema(
  {
    name: {
      type: String,
    },
    message: {
      type: String,
      required: [true, "Komentar harus diisi"],
      minlength: 1,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
