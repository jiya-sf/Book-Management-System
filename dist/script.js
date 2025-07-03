import { BookService } from './bookService.js';
const form = document.getElementById('bms-form');
const bookService = new BookService();
// Pre-fill form if editing
window.addEventListener('DOMContentLoaded', () => {
    const editBookData = localStorage.getItem('editBook');
    if (editBookData) {
        const book = JSON.parse(editBookData);
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn.toString();
        document.getElementById('pub-date').value = book.pubDate;
        document.getElementById('genre').value = book.genre;
        document.getElementById('book-type').value = book.bookType;
    }
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: parseInt(document.getElementById('isbn').value),
        pubDate: document.getElementById('pub-date').value,
        genre: document.getElementById('genre').value,
        bookType: document.getElementById('book-type').value
    };
    const editIndex = localStorage.getItem('editCheck');
    const index = editIndex ? parseInt(editIndex) : null;
    console.log("Saving book:", book);
    bookService.saveBook(book, index)
        .then(() => {
        localStorage.removeItem('editCheck');
        localStorage.removeItem('editBook');
        alert('Book saved successfully!');
        window.location.href = 'booklist.html';
    })
        .catch((err) => {
        console.error('Failed to save book:', err);
    });
});
