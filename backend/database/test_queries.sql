-- INSERT INTO Author (id, name)
-- VALUES (1, 'Sam');

-- INSERT INTO Category (id, name)
-- VALUES (1, 'Fiction');

-- SELECT * FROM Category;

-- INSERT INTO Book (id, title, isbn, pubDate, bookType, author_id, category_id)
-- VALUES (
--   1,
--   'Remnants',
--   9781234567890,
--   '2024-07-07',
--   'ebook',
--   1, -- references Author(id)
--   1  -- references Category(id)
-- );

INSERT INTO Author (id, name)
VALUES (2, 'J');

INSERT INTO Category (id, name)
VALUES (2, 'Science');

INSERT INTO Book (id, title, isbn, pubDate, bookType, author_id, category_id)
VALUES (
  2,
  'book',
  9722234567890,
  '2000-07-07',
  'printed',
  2, -- references Author(id)
  2  -- references Category(id)
);



SELECT * FROM BOOk
