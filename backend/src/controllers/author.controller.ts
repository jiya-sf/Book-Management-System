import { Request, Response } from "express";
import { AuthorModel } from "../models";
import { Logger } from "../observer/logger";

const authorLogger = new Logger<{ name: string }>(
  "Author",
  (data) => `Author created: ${data.name}`,
);

// create author
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const newAuthor = await AuthorModel.create(req.body);
    authorLogger.log({ name: newAuthor.get("name") as string });
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ message: "Failed to create author", error });
  }
};

export const getAllAuthors = async (_req: Request, res: Response) => {
  try {
    const authors = await AuthorModel.findAll();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Failed to get authors", error });
  }
};
