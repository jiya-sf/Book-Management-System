document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bms-form");

    const editCheck = parseInt(localStorage.getItem("editCheck"));
    const editBook = JSON.parse(localStorage.getItem("editBook"));

    if (editCheck !== null && editBook) {
        document.getElementById("title").value = editBook.title;
        document.getElementById("author").value = editBook.author;
        document.getElementById("isbn").value = editBook.isbn;
        document.getElementById("pub-date").value = editBook.pubDate;
        document.getElementById("genre").value = editBook.genre;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const isbn = document.getElementById("isbn").value.trim();
        const pubDate = document.getElementById("pub-date").value;
        const genre = document.getElementById("genre").value;

        if (!title || !author || !isbn || !pubDate || genre === "") {
            alert("Please fill in all fields");
            return;
        }

        if (isbn.length !== 13 || isNaN(isbn)) {
            alert("ISBN must be a 13-digit number");
            return;
        }

        const books = JSON.parse(localStorage.getItem("books")) || [];
        const newBook = { title, author, isbn, pubDate, genre };

        if (editCheck !== null) {
            books[editCheck] = newBook;
            localStorage.removeItem("editCheck");
            localStorage.removeItem("editBook");
            alert("Book updated successfully!");
        } else {
            books.push(newBook);
            alert("Book added successfully!");
        }

        localStorage.setItem("books", JSON.stringify(books));
        form.reset();
    });
});

