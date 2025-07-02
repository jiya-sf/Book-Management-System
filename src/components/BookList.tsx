// src/components/BookList.tsx
import { useEffect, useState } from "react";
import { BookService } from "../utils/bookService";
import type { BookData} from "../utils/bookInfo";
import {calcBookAge } from "../utils/bookInfo";
import { useNavigate } from "react-router-dom";

function BookList() {
  const [books, setBooks] = useState<BookData[]>([]);
  const navigate = useNavigate();
  const bookService = new BookService();

  useEffect(() => {
    const fetchBooks = async () => {
      const fetchedBooks = await bookService.getBooks();
      setBooks(fetchedBooks);
    };
    fetchBooks();
  }, []);

  const handleDelete=(index:number) => {
    if (!confirm("You are going to delete the book.")) return;
    bookService.deleteBook(index);
setBooks(function(prevBooks){
    const updatedBooks=prevBooks.filter(function(_, i) {
      return i!==index;
    });
    return updatedBooks;
  });
  };

  const handleEdit=(index:number) => {
    bookService.EditBook(index);
    navigate("/add");
  };

  if (books.length === 0) {
    return <p className="text-gray-300 mt-6">No books added yet.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {books.map((book,i)=>(
        <div key={i} className="w-80 p-6 rounded-lg shadow-lg bg-white/30 backdrop-blur-sm">
          <h5 className="mb-2 text-xl font-bold text-white">{book.title}</h5>
          <p className="mb-1 text-gray-800">Author: {book.author}</p>
          <p className="mb-1 text-gray-800">ISBN: {book.isbn}</p>
          <p className="mb-1 text-gray-800">
          Published: {book.pubDate} ({calcBookAge.calc(book.pubDate)} years ago)
          </p>
          <p className="mb-1 text-gray-800">Genre: {book.genre}</p>
          <p className="mb-4 text-gray-800">Format: {book.bookType}</p>
          <div className="flex gap-2">
            <button onClick={()=>handleDelete(i)} className="px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none" >
              Delete
            </button>
            <button onClick={() => handleEdit(i)} className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookList;
