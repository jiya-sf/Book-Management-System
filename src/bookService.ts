import {BookData} from './bookInfo.js';

export class BookService {
  getBooks():Promise<BookData[]>{
    return new Promise((resolve,reject) =>{
      setTimeout(()=>{
        try{
          const books:BookData[]=JSON.parse(localStorage.getItem("books")||"[]");
          resolve(books);
        } catch(err){
          reject(err);
        }
      },1000);
    });
  }

  saveBooks(books:BookData[]):void {
    localStorage.setItem("books",JSON.stringify(books));
  }

  saveBook(book:BookData,index:number|null):Promise<BookData[]>{
    return new Promise((resolve,reject)=>{
      try{
        const books:BookData[]=JSON.parse(localStorage.getItem("books")||"[]");
        if (index!==null && !isNaN(index)){
          books[index] = book;
        } else{
          books.push(book);
        }
        this.saveBooks(books);
        resolve(books);
      } catch (err){
        reject(err);
      }
    });
  }

  deleteBook(index:number):void {
    const books:BookData[]=JSON.parse(localStorage.getItem("books")||"[]");
    books.splice(index,1);
    this.saveBooks(books);
  }

  EditBook(index:number):void {
    const books:BookData[]=JSON.parse(localStorage.getItem("books")||"[]");
    const editBook=books[index];
    localStorage.setItem("editCheck",index.toString());
    localStorage.setItem("editBook",JSON.stringify(editBook));
  }
}
