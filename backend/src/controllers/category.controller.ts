import { Request, Response } from 'express';
import { CategoryModel } from '../models';
import { Logger } from '../observer/logger';

const categoryLogger = new Logger<{ name: string }>(
  'Category',(data) => `Category created: ${data.name}`
);

export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await CategoryModel.create(req.body);
        categoryLogger.log({ name: newCategory.get('name') as string });
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
