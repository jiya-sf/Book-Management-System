import {Link } from 'react-router-dom';
function Navbar() {
  return (
    <nav className="flex flex-col md:flex-row items-center">
      <div className="text-2xl w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
        Book Management System
      </div>

      <ul className="md:flex md:flex-1 justify-end text-center md:text-right">
        <li className="list-none inline-block px-7">
          <Link to="/" className="no-underline px-2 hover:text-gray-300">
            Home
          </Link>
        </li>
        <li className="list-none inline-block px-7">
          <Link to="/add" className="no-underline px-2">
            Adding a book
          </Link>
        </li>
        <li className="list-none inline-block px-7">
          <Link to="/booklist" className="no-underline px-2">
            BookList
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
