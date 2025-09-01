import { Request, Response } from "express";
import { BookFacade } from "../facade/book.facade";
import { Logger } from "../observer/logger";
import { title } from "process";

const bookLogger = new Logger<{ title: string; isbn: number }>(
  "Book",
  (data) => `Created:${data.title} (ISBN:{data.isbn})`,
);

///mapping to frontend
const mapBook = (book: any) => ({
  id: book.id,
  title: book.title,
  author: book.Author ? book.Author.name : "",
  isbn: book.isbn,
  pubDate: book.pubDate,
  genre: book.Category ? book.Category.name : "",
  bookType: book.bookType,
});

//creating
export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = await BookFacade.create(req.body);
    bookLogger.log({
      title: newBook.get("title") as string,
      isbn: newBook.get("isbn") as number,
    });
    res.status(200).json(newBook);
  } catch (error: any) {
    console.error("Create Error:", error);
    res.status(500).json({ message: "Failed to create book", error });
  }
};
//get all books
export const getAllBooks = async (_req: Request, res: Response) => {
  try {
    const books = await BookFacade.getAllBooks();
    const formattedBooks = books.map(mapBook);
    res.status(200).json(formattedBooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to get books", error });
  }
};

// Get a book by id
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await BookFacade.getBookById(req.params.id);
    if (book) {
      const formattedBooks = mapBook(book);
      res.status(200).json(formattedBooks);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book", error });
  }
};

// Updating
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await BookFacade.updateBook(req.params.id, req.body);
    if (!book) return res.status(404).json({ message: "Book not found" });
    await book.update(req.body);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error });
  }
};

// Deleting
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await BookFacade.deleteBook(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await book.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error });
  }
};
