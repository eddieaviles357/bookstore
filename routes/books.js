const express = require("express");
const Book = require("../models/book");
const jsonSchema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");
const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    // is the body valid?
    const validatedSchema = jsonSchema.validate(req.body, bookSchema);
    if(!validatedSchema.valid) {
      return res.status(400).json({ errors: validatedSchema.errors.map(errors => errors.stack) });
    }
    // create a new book
    const book = await Book.create(req.body.book);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    // is the body valid?
    const validatedSchema = jsonSchema.validate(req.body, updateBookSchema);
    if(!validatedSchema.valid) {
      return res.status(400).json({ errors: validatedSchema.errors.map(errors => errors.stack) });
    }
    const book = await Book.update(req.params.isbn, req.body.book);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
