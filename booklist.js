document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("book-box");
    let books = JSON.parse(localStorage.getItem("books")) || [];

    if (books.length === 0) {
        container.innerHTML = "<p>No books added yet.</p>";
        return;
    }

    books.forEach((book, index) => {
        const age = calculateBookAge(book.pubDate);
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <p>Title:${book.title}</p>
            <p>Author: ${book.author}</p>
            <p>ISBN: ${book.isbn}</p>
            <p>Published: ${book.pubDate} (Age: ${age} years)</p>
            <p>Genre: ${book.genre}</p>
            <button onclick="deleteBook(${index})">Delete</button>
            <button onclick="editBook(${index})">Edit</button>

        `;
        container.appendChild(bookCard);
    });
});

function calculateBookAge(pubDate) {
    const pub = new Date(pubDate);
    const now = new Date();
    return now.getFullYear() - pub.getFullYear();
}

function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    location.reload();
}

function editBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const editBook = books[index];
    localStorage.setItem("editCheck", index);
    localStorage.setItem("editBook", JSON.stringify(editBook));
    window.location.href = "index.html";
}

