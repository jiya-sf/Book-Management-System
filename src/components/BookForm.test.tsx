import { render, screen,fireEvent, waitFor} from '@testing-library/react';
import BookForm from './BookForm';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

test('renders Bookform with all inputs',()=>{
  render(<BrowserRouter><BookForm/></BrowserRouter>);

  expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/isbn/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/publication date/i)).toBeInTheDocument();

});

test('allows typing in title input',()=>{
  render(<BrowserRouter><BookForm/></BrowserRouter>);
  const titleInput=screen.getByLabelText(/title/i);
  fireEvent.change(titleInput,{target:{value:'react'}});
  expect(titleInput).toHaveValue('react');
});

//isbn check
test('checks if isbn is 13 digits ',async()=>{
  window.alert = jest.fn(); 
  render(<BrowserRouter><BookForm/></BrowserRouter>);
  fireEvent.change(screen.getByLabelText(/title/i),{target:{value:"book"}});
  fireEvent.change(screen.getByLabelText(/author/i),{target:{value:"author"}});
  fireEvent.change(screen.getByLabelText(/isbn/i),{target:{value:"123456789111"}});
  fireEvent.change(screen.getByLabelText(/publication date/i),{target:{value:"2020-02-09"}});
  const dropdowns=screen.getAllByRole('combobox');
  fireEvent.change(dropdowns[0],{target:{value:'fiction'}});
  fireEvent.change(dropdowns[1],{target:{value:'ebook'}});

  fireEvent.click(screen.getByRole('button',{name: /add book/i}));
  await waitFor(()=>{
expect(window.alert).toHaveBeenCalledWith('ISBN must be exactly 13 digits.');  })
})
//prefill check
test('check if it prefills form if in edit mode', ()=>{
  const bookToEdit = {
    title:'bookname',author:'a',isbn:1234567890123,pubDate:'2020-05-01',genre:'history',bookType:'printed',
  };
  localStorage.setItem('editBook',JSON.stringify(bookToEdit));
  localStorage.setItem('editCheck','0');
  render(<BrowserRouter><BookForm/></BrowserRouter>);
  expect(screen.getByLabelText(/title/i)).toHaveValue('bookname');
  expect(screen.getByRole('button',{name:/update book/i})).toBeInTheDocument();
});


