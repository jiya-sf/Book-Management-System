import {useState} from 'react';
import {BookService} from '../utils/bookService';
import type {BookData} from '../utils/bookInfo';
import {useNavigate} from 'react-router-dom';

function BookForm() {
  const navigate=useNavigate();
  const bookService=new BookService();
  const [formData,setFormData]= useState<BookData>(()=>{
    const editBook=localStorage.getItem("editBook");
    return editBook? JSON.parse(editBook):
    {
    title:'',
    author:'',
    isbn:0,
    pubDate:'',
    genre:'',
    bookType:'ebook',
    };
  });

  const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const{name,value }=e.target;
    setFormData((prev) =>({
      ...prev,
      [name]:name==='isbn'?parseInt(value):value,
    }));
  };

  const handleSubmit=async(e:React.FormEvent) =>{
    e.preventDefault();
    try {
      const index=localStorage.getItem("editCheck");
      await bookService.saveBook(formData,index!==null?parseInt(index):null);
      localStorage.removeItem("editBook");
      localStorage.removeItem("editCheck");
      navigate('/booklist');
    } catch(err){
      console.error("Failed to save book:",err);
    }
  };

  return(
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm text-white p-8 rounded-2xl shadow-lg w-full max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add a Book</h2>

      <div className="relative z-0 w-full group">
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
          className="peer w-full border-b-2 border-gray-300 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400 text-sm pt-6 pb-1"
          placeholder=" " />
        <label htmlFor="title"
          className="absolute text-gray-300 text-sm left-0 top-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-300">Title</label>
      </div>

      <div className="relative z-0 w-full group">
        <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required
          className="peer w-full border-b-2 border-gray-300 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400 text-sm pt-6 pb-1"
          placeholder=" " />
        <label htmlFor="author"
          className="absolute text-gray-300 text-sm left-0 top-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-300">Author</label>
      </div>

      <div className="relative z-0 w-full group">
        <input type="number" id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} required
          className="peer w-full border-b-2 border-gray-300 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400 text-sm pt-6 pb-1"
          placeholder=" " />
        <label htmlFor="isbn"
          className="absolute text-gray-300 text-sm left-0 top-1 transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-300">ISBN</label>
      </div>

      <div className="relative z-0 w-full group">
        <input type="date" id="pubDate" name="pubDate" value={formData.pubDate} onChange={handleChange} required
          className="peer w-full border-b-2 border-gray-300 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400 text-sm pt-6 pb-1"
          placeholder=" " />
        <label htmlFor="pubDate"
          className="absolute text-gray-300 text-sm left-0 top-1 transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-300">Publication Date</label>
      </div>

      <div className="relative z-0 w-full group">
        <select id="genre" name="genre" value={formData.genre} onChange={handleChange} required
          className="py-2.5 w-full bg-transparent text-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-400 text-sm">
          <option value="" className="text-black">Select genre</option>
          <option value="fiction" className="text-black">Fiction</option>
          <option value="non-fiction" className="text-black">Non-fiction</option>
          <option value="mystery" className="text-black">Mystery</option>
          <option value="fantasy" className="text-black">Fantasy</option>
          <option value="science-fiction" className="text-black">Science Fiction</option>
          <option value="biography" className="text-black">Biography</option>
          <option value="history" className="text-black">History</option>
          <option value="horror" className="text-black">Horror</option>
          <option value="self-help" className="text-black">Self-help</option>
        </select>
      </div>

      <div className="relative z-0 w-full group">
        <select id="bookType" name="bookType" value={formData.bookType} onChange={handleChange} required
          className="py-2.5 w-full bg-transparent text-white border-b-2 border-gray-300 focus:outline-none focus:border-blue-400 text-sm">
          <option value="" className="text-black">Select book type</option>
          <option value="ebook" className="text-black">Ebook</option>
          <option value="printed" className="text-black">Printed Book</option>
        </select>
      </div>

      <div className="flex space-x-4">
        <button type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">
          {localStorage.getItem("editCheck") ? "Update Book" : "Add Book"}
        </button>
      </div>
    </form>
  );
}

export default BookForm;
