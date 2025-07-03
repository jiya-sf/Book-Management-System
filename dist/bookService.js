export class BookService {
    getBooks() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const books = JSON.parse(localStorage.getItem("books") || "[]");
                    resolve(books);
                }
                catch (err) {
                    reject(err);
                }
            }, 1000);
        });
    }
    saveBooks(books) {
        localStorage.setItem("books", JSON.stringify(books));
    }
    saveBook(book, index) {
        return new Promise((resolve, reject) => {
            try {
                const books = JSON.parse(localStorage.getItem("books") || "[]");
                if (index !== null && !isNaN(index)) {
                    books[index] = book;
                }
                else {
                    books.push(book);
                }
                this.saveBooks(books);
                resolve(books);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    deleteBook(index) {
        const books = JSON.parse(localStorage.getItem("books") || "[]");
        books.splice(index, 1);
        this.saveBooks(books);
    }
    EditBook(index) {
        const books = JSON.parse(localStorage.getItem("books") || "[]");
        const editBook = books[index];
        localStorage.setItem("editCheck", index.toString());
        localStorage.setItem("editBook", JSON.stringify(editBook));
    }
}
