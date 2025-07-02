import BookForm from './BookForm';

function AddBook(){
  return (
    <div className="text-white min-h-screen w-full bg-[url('./assets/b8.png')] bg-cover bg-center bg-[#5a5a5b] bg-blend-overlay 
    px-4 sm:px-10 md:px-20 py-5 flex justify-center items-start">
      <BookForm/>
    </div>
  );
}

export default AddBook;
