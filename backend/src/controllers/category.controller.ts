import { Request, Response } from 'express';
import { CategoryModel } from '../models';
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await CategoryModel.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get categories', error });
  }
};
