import { Book, BookData,calcBookAge } from "./bookInfo.js";
import { BookService } from "./bookService.js";

const bookService = new BookService();
const container = document.getElementById("book-box") as HTMLElement;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const books: BookData[] = await bookService.getBooks();
    
    if (books.length === 0) {
      container.innerHTML = "<p class='text-gray-600'>No books added yet.</p>";
      return;
    }

    books.forEach((bookData: BookData, i: number) => {
      const book = new Book(
        bookData.title,
        bookData.author,
        bookData.isbn,
        bookData.pubDate,
        bookData.genre,
        bookData.bookType
      );

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
  } catch (error: any) {
    container.innerHTML = `<p class='text-red-600'>Error loading books: ${error.message}</p>`;
  }
});

function addEventListeners(): void {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt((btn as HTMLElement).dataset.index!);
      if (!confirm("You are going to delete the book.")) return;

      bookService.deleteBook(index);
      location.reload();
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt((btn as HTMLElement).dataset.index!);
      bookService.EditBook(index);
      window.location.href = "formmain.html";
    });
  });
}
