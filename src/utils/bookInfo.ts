export interface BookData{
    title:string;
    author:string;
    isbn:number;         
    pubDate:string;       
    genre:string;
    bookType:'ebook'|'printed';
}

export interface Author{
    id:string;
    name:string;
    bookIds?:string[];
}
export interface Category{
    id:string;
    genre:string;
    description?:string;
}
export class Book implements BookData {
  title: string;
  author: string;
  isbn: number;
  pubDate: string;
  genre: string;
  bookType: 'ebook' | 'printed';

  constructor(
    title: string,
    author: string,
    isbn: number,
    pubDate: string,
    genre: string,
    bookType: 'ebook' | 'printed'
  ) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.pubDate = pubDate;
    this.genre = genre;
    this.bookType = bookType;
  }
}

export class calcBookAge{
  static calc(pubDate:string):number{
    const pub=new Date(pubDate);
    const now =new Date();
    return now.getFullYear()-pub.getFullYear();
  }
}
export class discount{
  static discountPrice(price:number,percent:number):number{
    return price-(price*percent)/100;
  }
}