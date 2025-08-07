const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  author: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },

  category: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  image: {
    type: String, // Cloudinary URL or local path
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
