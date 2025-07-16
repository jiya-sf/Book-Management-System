    import {render,screen,fireEvent } from '@testing-library/react';
    import BookList from './BookList';
    import { BrowserRouter } from 'react-router-dom';
    import '@testing-library/jest-dom';

    const mockBooks=[
    {title:'Mock book',author:'Mock author',isbn:1234567890123,pubDate:'2020-01-01', genre:'fiction', bookType:'ebook',}
    ];

    jest.mock('../utils/bookService',()=>{
    return{
        BookService:jest.fn().mockImplementation(()=>({
        getBooks:jest.fn().mockResolvedValue(mockBooks),
        deleteBook:jest.fn(),
        EditBook:jest.fn(),
        }))
    };
    });

    test('checks for when there are no books',async()=>{
        const {BookService} = require('../utils/bookService');
        
        BookService.mockImplementationOnce(()=>({
        getBooks:jest.fn().mockResolvedValue([]),
        deleteBook:jest.fn(),
        EditBook: jest.fn(),
        }));
        render(<BrowserRouter><BookList/></BrowserRouter>);
        expect(await screen.findByText(/no books added yet/i)).toBeInTheDocument();
    });
    test('renders books from service', async()=>{
        render(<BrowserRouter><BookList/></BrowserRouter>);
        expect(await screen.findByText('Mock book')).toBeInTheDocument();
        expect(screen.getByText(/Author: Mock author/)).toBeInTheDocument();
        expect(screen.getByText(/1234567890123/)).toBeInTheDocument();
        expect(screen.getByText(/ebook/)).toBeInTheDocument();
    });
    test('delete',async()=>{
        const confirmSpy=jest.spyOn(window,'confirm').mockReturnValue(true);
        render(<BrowserRouter><BookList/></BrowserRouter>);
        const deleteButton=await screen.findByRole('button',{ name:/delete/i});
        fireEvent.click(deleteButton);
        expect(confirmSpy).toHaveBeenCalled();
    });
    test('edit',async()=>{
        render(<BrowserRouter><BookList/></BrowserRouter>);
        const editButton=await screen.findByRole('button',{name: /edit/i});
        fireEvent.click(editButton);
        expect(editButton).toBeInTheDocument();
    });
 