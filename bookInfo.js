class BookInfo{
    constructor(title,author,isbn,pubDate,genre){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
        this.pubDate=pubDate;
        this.genre=genre;
    }
    calcBookAge(pubDate){
        const pub=new Date(this.pubDate);
        const now=new Date();
        return now.getFullYear()-pub.getFullYear();
    }
    discountPrice(price,discPercent){
        return price-(price*discPercent)/100;
    }
}
class Ebook extends BookInfo{
    constructor(title,author,isbn,pubDate,genre){
        super(title,author,isbn,pubDate,genre);
        this.format='digital';
    }
}
class PrintedBook extends BookInfo {
    constructor(title,author,isbn,pubDate,genre) {
        super(title,author,isbn,pubDate,genre);
                this.format='paper';
    }
}
