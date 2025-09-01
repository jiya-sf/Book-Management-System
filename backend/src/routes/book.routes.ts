import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

const booksRouter = express.Router();

// CRUD routes
booksRouter.post("/", createBook);
booksRouter.get("/", getAllBooks);
booksRouter.get("/:id", getBookById);

export default booksRouter;
