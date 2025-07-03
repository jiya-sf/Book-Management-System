var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Book, calcBookAge } from "./bookInfo.js";
import { BookService } from "./bookService.js";
const bookService = new BookService();
const container = document.getElementById("book-box");
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield bookService.getBooks();
        if (books.length === 0) {
            container.innerHTML = "<p class='text-gray-600'>No books added yet.</p>";
            return;
        }
        books.forEach((bookData, i) => {
            const book = new Book(bookData.title, bookData.author, bookData.isbn, bookData.pubDate, bookData.genre, bookData.bookType);
            const bookCard = document.createElement("div");
            bookCard.className = "w-80 p-6 rounded-lg shadow-lg bg-white/30 backdrop-blur-sm";
            bookCard.innerHTML = `
        <h5 class="mb-2 text-xl font-bold text-white">${book.title}</h5>
        <p class="mb-1 text-gray-800">Author: ${book.author}</p>
        <p class="mb-1 text-gray-800">ISBN: ${book.isbn}</p>
<p class="mb-1 text-gray-800">Published: ${book.pubDate} (${calcBookAge.calc(book.pubDate)} years ago)</p>
        <p class="mb-4 text-gray-800">Genre: ${book.genre}</p>
        <p class="mb-4 text-gray-800">Format: ${book.bookType}</p>

        <div class="flex gap-2">
          <button data-index="${i}" class="delete-btn px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none">Delete</button>
          <button data-index="${i}" class="edit-btn px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none">Edit</button>
        </div>
      `;
            container.appendChild(bookCard);
        });
        addEventListeners();
    }
    catch (error) {
        container.innerHTML = `<p class='text-red-600'>Error loading books: ${error.message}</p>`;
    }
}));
function addEventListeners() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            if (!confirm("You are going to delete the book."))
                return;
            bookService.deleteBook(index);
            location.reload();
        });
    });
    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            bookService.EditBook(index);
            window.location.href = "formmain.html";
        });
    });
}
