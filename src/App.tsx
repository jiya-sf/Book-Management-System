import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";

function App() {
  return (
    <BrowserRouter>
      <div className="text-white min-h-screen w-full bg-[url('./assets/b8.png')] bg-cover bg-center bg-[#5a5a5b] bg-blend-overlay px-4 sm:px-10 md:px-20 py-5">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/booklist" element={<BookList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
