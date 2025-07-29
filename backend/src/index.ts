import express from 'express';
import cors from 'cors';

import booksRouter from './routes/book.routes';
import {sequelize } from './models';
import './models';

const app=express();
const PORT=5000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('BMS API is running!');
});

app.use('/api/books',booksRouter);

sequelize.authenticate().then(() => {
  console.log('Database synced');

  app.listen(PORT,() => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((err)=> {
  console.error('DB sync failed:', err);
});
