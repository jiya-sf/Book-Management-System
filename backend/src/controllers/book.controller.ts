import {Request,Response } from 'express';
import {BookModel,AuthorModel,CategoryModel } from '../models';


//creating
export const createBook = async (req:Request,res:Response) => {
  try {
    const newBook = await BookModel.create(req.body);
    res.status(200).json(newBook);
  }catch(error) {
    console.error('Create Error:',error);
    res.status(500).json({ message: 'Failed to create book',error });
  }
};
//get all books
export const getAllBooks = async (_req:Request, res:Response) => {
  try {
    const books=await BookModel.findAll({
      include:[AuthorModel, CategoryModel],
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get books',error });
  }
};

// Get a book by id
export const getBookById = async(req:Request,res:Response)=>{
  try{
    const book=await BookModel.findByPk(req.params.id,{
      include:[AuthorModel,CategoryModel],
    });
    if(book){
      res.status(200).json(book);
    }else{
      res.status(404).json({message:'Book not found'});
    }
  } catch(error) {
    res.status(500).json({ message: 'Failed to fetch book', error });
  }
};

// Updating
export const updateBook = async (req:Request,res:Response) => {
  try {
    const book=await BookModel.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await book.update(req.body);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error });
  }
};

// Deleting
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await BookModel.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await book.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error });
  }
};
