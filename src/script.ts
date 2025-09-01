import { BookData } from "./bookInfo.js";
import { BookService } from "./bookService.js";

const form = document.getElementById("bms-form") as HTMLFormElement;
const bookService = new BookService();

// Pre-fill form if editing
window.addEventListener("DOMContentLoaded", () => {
  const editBookData = localStorage.getItem("editBook");

  if (editBookData) {
    const book: BookData = JSON.parse(editBookData);

    (document.getElementById("title") as HTMLInputElement).value = book.title;
    (document.getElementById("author") as HTMLInputElement).value = book.author;
    (document.getElementById("isbn") as HTMLInputElement).value =
      book.isbn.toString();
    (document.getElementById("pub-date") as HTMLInputElement).value =
      book.pubDate;
    (document.getElementById("genre") as HTMLSelectElement).value = book.genre;
    (document.getElementById("book-type") as HTMLSelectElement).value =
      book.bookType;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const book: BookData = {
    title: (document.getElementById("title") as HTMLInputElement).value,
    author: (document.getElementById("author") as HTMLInputElement).value,
    isbn: parseInt((document.getElementById("isbn") as HTMLInputElement).value),
    pubDate: (document.getElementById("pub-date") as HTMLInputElement).value,
    genre: (document.getElementById("genre") as HTMLSelectElement).value,
    bookType: (document.getElementById("book-type") as HTMLSelectElement)
      .value as "ebook" | "printed",
  };

  const editIndex = localStorage.getItem("editCheck");
  const index = editIndex ? parseInt(editIndex) : null;

  console.log("Saving book:", book);

  bookService
    .saveBook(book, index)
    .then(() => {
      localStorage.removeItem("editCheck");
      localStorage.removeItem("editBook");
      alert("Book saved successfully!");
      window.location.href = "booklist.html";
    })
    .catch((err) => {
      console.error("Failed to save book:", err);
    });
});
