const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active",
  },
  typeBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypeBook",
    required: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
