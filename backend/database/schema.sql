CREATE TABLE Author (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE Category (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE Book (
  id INT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  isbn BIGINT,
  pubDate DATE,
  bookType ENUM('ebook', 'printed'),
  author_id INT,
  category_id INT,
  FOREIGN KEY (author_id) REFERENCES Author(id),
  FOREIGN KEY (category_id) REFERENCES Category(id)
);
