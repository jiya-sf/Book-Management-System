export class Book {
    constructor(title, author, isbn, pubDate, genre, bookType) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.pubDate = pubDate;
        this.genre = genre;
        this.bookType = bookType;
    }
}
export class calcBookAge {
    static calc(pubDate) {
        const pub = new Date(pubDate);
        const now = new Date();
        return now.getFullYear() - pub.getFullYear();
    }
}
export class discount {
    static discountPrice(price, percent) {
        return price - (price * percent) / 100;
    }
}
